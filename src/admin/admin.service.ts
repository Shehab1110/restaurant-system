import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/order.schema';
import { Model, Query, UpdateQuery } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  getOrders(): Query<OrderDocument[], OrderDocument> {
    return this.orderModel.find({}).populate('user', 'userName');
  }

  async updateOrder(order: {
    orderID: string;
    status: string;
    totalPrice: number;
    address: string;
  }): Promise<OrderDocument> {
    if (!order.status && !order.totalPrice && !order.address)
      throw new BadRequestException(
        `One of the following must be provided for the update: ['status', 'totalPrice', 'address' ]`,
      );
    const updateQuery: UpdateQuery<OrderDocument> = {};
    if (order.status !== undefined) updateQuery.status = order.status;
    if (order.totalPrice !== undefined)
      updateQuery.totalPrice = order.totalPrice;
    if (order.address !== undefined) updateQuery.address = order.address;

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(order.orderID, updateQuery, { new: true, lean: true })
      .populate('user', 'userName');
    if (!updatedOrder)
      throw new NotFoundException('No found order with the provided order ID!');
    return updatedOrder;
  }

  // async getDailySalesReport(date: Date) {
  //   // Set the start to the beginning of the specified day
  //   const startDate = new Date(date);
  //   startDate.setHours(0, 0, 0, 0);
  //   // Set the end to the end of the specified day
  //   const endDate = new Date(date);
  //   endDate.setHours(23, 59, 59, 999);

  //   const salesReport = await this.orderModel.aggregate([
  //     {
  //       $match: {
  //         createdAt: {
  //           $gte: startDate,
  //           $lte: endDate,
  //         },
  //         status: { $ne: 'cancelled' },
  //       },
  //     },
  //     {
  //       $unwind: '$orderItems',
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',
  //         localField: 'orderItems.product',
  //         foreignField: '_id',
  //         as: 'productDetails',
  //       },
  //     },
  //     {
  //       $unwind: '$productDetails',
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           productId: '$orderItems.product',
  //           name: '$productDetails.name',
  //           price: '$productDetails.price',
  //         },
  //         totalQuantity: { $sum: '$orderItems.quantity' },
  //         totalSales: {
  //           $sum: {
  //             $multiply: ['$orderItems.quantity', '$productDetails.price'],
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $sort: { totalQuantity: -1 },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         totalRevenue: { $sum: '$totalSales' },
  //         totalOrders: { $sum: 1 },
  //         topSellingItems: {
  //           $push: {
  //             productId: '$_id.productId',
  //             name: '$_id.name',
  //             price: '$_id.price',
  //             totalQuantity: '$totalQuantity',
  //             totalSales: '$totalSales',
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         totalRevenue: 1,
  //         totalOrders: 1,
  //         topSellingItems: 1,
  //       },
  //     },
  //   ]);

  //   return (
  //     salesReport[0] || { totalRevenue: 0, totalOrders: 0, topSellingItems: [] }
  //   );
  // }

  async getDailySalesReport(date: Date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const salesReport = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: {
            productId: '$orderItems.product',
            name: '$productDetails.name',
            price: '$productDetails.price',
          },
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalSales: {
            $sum: {
              $multiply: ['$orderItems.quantity', '$productDetails.price'],
            },
          },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalSales' },
          topSellingItems: {
            $push: {
              productId: '$_id.productId',
              name: '$_id.name',
              price: '$_id.price',
              totalQuantity: '$totalQuantity',
              totalSales: '$totalSales',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'orders',
          let: { start: startDate, end: endDate },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gte: ['$createdAt', '$$start'] },
                    { $lte: ['$createdAt', '$$end'] },
                    { $ne: ['$status', 'cancelled'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
              },
            },
          ],
          as: 'orderSummary',
        },
      },
      {
        $addFields: {
          totalOrders: { $arrayElemAt: ['$orderSummary.totalOrders', 0] },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          topSellingItems: 1,
        },
      },
    ]);

    return (
      salesReport[0] || { totalRevenue: 0, totalOrders: 0, topSellingItems: [] }
    );
  }
}
