import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './cart.schema';
import { CartRepository } from './cart.repository';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    ProductModule,
    UserModule,
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
  exports: [CartRepository],
})
export class CartModule {}
