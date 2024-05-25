import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDocument } from './order.schema';
import { CurrentUser } from 'src/user/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CancelOrderDto } from './dtos/cancel-order.dto';
import { APIFeatures, QueryString } from 'src/utils/api-features';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderAddersDto } from './dtos/update-order-address.dto';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(200)
  @Post('make-order')
  async makeOrder(
    @CurrentUser('id') userID: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDocument> {
    return this.orderService.makeOrder(userID, createOrderDto.address);
  }

  @Get()
  async getMyOrders(
    @CurrentUser('id') userID: string,
    @Query() queryString: QueryString,
  ): Promise<OrderDocument[]> {
    const features = new APIFeatures(
      this.orderService.getMyOrders(userID),
      queryString,
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();
    return await features.query;
  }

  @Patch('cancel-order')
  async cancelOrder(
    @Body() cancelOrderDto: CancelOrderDto,
    @CurrentUser('id') userID: string,
  ) {
    return this.orderService.cancelOrder(cancelOrderDto.orderID, userID);
  }

  @Patch('update-order')
  async updateOrderItemQty(
    @CurrentUser('id') userID: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDocument> {
    const { orderID, productID, quantity } = updateOrderDto;
    return this.orderService.updateOrderItemQty(
      userID,
      orderID,
      productID,
      quantity,
    );
  }

  @Patch('update-order-address')
  async updateOrderAddress(
    @CurrentUser('id') userID: string,
    @Body() updateOrderAddressDto: UpdateOrderAddersDto,
  ) {
    return this.orderService.updateOrderAddress(userID, updateOrderAddressDto);
  }
}
