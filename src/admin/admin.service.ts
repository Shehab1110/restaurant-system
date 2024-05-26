import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/order.schema';
import { Model, Query, UpdateQuery } from 'mongoose';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly redisService: RedisService,
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

  async getDailySalesReport(date: Date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const cacheKey = `salesReport:${startDate.toISOString()}:${endDate.toISOString()}`;
    const redisClient = this.redisService.getClient();

    const cachedReport = await redisClient.get(cacheKey);
    if (cachedReport) {
      console.log('Serving from cache!');
      return JSON.parse(cachedReport);
    }
    const salesReport = await this.orderModel.aggregate([
      // Stage 1: Match orders within the date range and not cancelled
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          status: { $ne: 'cancelled' },
        },
      },
      // Stage 2: Unwind orderItems array
      {
        $unwind: '$orderItems',
      },
      // Stage 3: Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      // Stage 4: Unwind productDetails array
      {
        $unwind: '$productDetails',
      },
      // Stage 5: Group by productId, name, and price to calculate total quantity and total sales per product
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
      // Stage 6: Sort products by total quantity sold in descending order
      {
        $sort: { totalQuantity: -1 },
      },
      // Stage 7: Group the results to calculate total revenue and push top-selling items into an array
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
      // Stage 8: Lookup total number of orders within the date range
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
              $count: 'totalOrders',
            },
          ],
          as: 'orderSummary',
        },
      },
      // Stage 9: Add totalOrders to the final output
      {
        $addFields: {
          totalOrders: { $arrayElemAt: ['$orderSummary.totalOrders', 0] },
        },
      },
      // Stage 10: Project the final result
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: { $ifNull: ['$totalOrders', 0] },
          topSellingItems: 1,
        },
      },
    ]);
    const report = salesReport[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      topSellingItems: [],
    };

    // Note: The cache is flushed every time a POST http://{{URL}}/orders/make-order request is made.
    // Caching for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(report), { EX: 60 * 60 });

    return report;
  }
}
