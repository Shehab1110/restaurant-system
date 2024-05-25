import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './order.schema';
import { CartModule } from 'src/cart/cart.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    CartModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
})
export class OrderModule {}
