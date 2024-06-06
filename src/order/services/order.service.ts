import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../database/order.schema';
import { Model, Query } from 'mongoose';
import { CartRepository } from 'src/database/cart.repository';
import { RedisService } from 'src/redis/services/redis.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly cartRepository: CartRepository,
    private readonly redisService: RedisService,
  ) {}

  async makeOrder(userID: string, address: string): Promise<OrderDocument> {
    const cart = await this.cartRepository.findCartByUserID(userID);
    if (!cart || cart.cartItems.length === 0)
      throw new BadRequestException('No cart found!');
    const orderCreationPromise = this.orderModel.create({
      user: userID,
      orderItems: cart.cartItems,
      totalPrice: cart.totalPrice,
      address,
    });
    const cartRemovalPromise = this.cartRepository.deleteCart(userID);
    const cacheFlushingPromise = this.redisService.flushAll();
    const [orderDocument] = await Promise.all([
      orderCreationPromise,
      cartRemovalPromise,
      cacheFlushingPromise,
    ]);
    return orderDocument;
  }

  getMyOrders(userID: string): Query<OrderDocument[], OrderDocument> {
    return this.orderModel.find({ user: userID }).lean();
  }

  async cancelOrder(orderID: string, userID: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOneAndUpdate(
        {
          _id: orderID,
          user: userID,
          status: 'pending',
        },
        {
          status: 'cancelled',
        },
        { new: true },
      )
      .lean();

    if (!order)
      throw new ForbiddenException(
        'You can only cancel your orders and only pending ones!',
      );

    return order;
  }

  async updateOrderItemQty(
    userID: string,
    orderID: string,
    productID: string,
    quantity: number,
  ): Promise<OrderDocument> {
    // const updatedOrder = await this.orderModel.findOneAndUpdate(
    //   {
    //     _id: orderID,
    //     user: userID,
    //     status: 'pending'
    //   },
    //   {
    //     $set: { 'orderItems.$[item].quantity': quantity },
    //   },
    //   {
    //     arrayFilters: [{ 'item.product.id': productID }],
    //     new: true,
    //   },
    // );
    // if (!updatedOrder)
    //   throw new ForbiddenException('You can only modify your own pending orders!');
    // updatedOrder.totalPrice = updatedOrder.calcTotalPrice();
    // return updatedOrder.save();
    const order = await this.orderModel.findOne({
      _id: orderID,
      user: userID,
    });
    if (!order)
      throw new ForbiddenException('You can only modify your own orders!');

    if (order.status !== 'pending')
      throw new BadRequestException(`Your order is already ${order.status}`);

    // The product field is already populated here...
    const index = order.orderItems.findIndex(
      (item) => (item.product as any).id === productID,
    );
    console.log(index);
    if (index !== -1) {
      order.orderItems[index].quantity = quantity;
      order.totalPrice = await order.calcTotalPrice();
      return order.save();
    }
    throw new BadRequestException(
      'Product with the provided product ID is not within the order!',
    );
  }

  async updateOrderAddress(
    userID: string,
    order: { orderID: string; address: string },
  ): Promise<OrderDocument> {
    const existingOrder = await this.orderModel.findOne({
      _id: order.orderID,
      user: userID,
    });
    if (!existingOrder) throw new NotFoundException('No order found!');
    if (existingOrder.status !== 'pending')
      throw new BadRequestException(
        `The order is already ${existingOrder.status}`,
      );
    existingOrder.set('address', order.address);
    return existingOrder.save();
  }
}
