import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDocument } from './cart.schema';
import { CurrentUser } from 'src/user/user.decorator';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { DeleteCartDto } from './dtos/delete-cart.dto';

@UseGuards(AuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @Get('my-cart')
  async getMyCart(@CurrentUser('id') userID: string): Promise<CartDocument> {
    const cart = await this.cartsService.getMyCart(userID);
    if (!cart) throw new NotFoundException('Cart not found!');
    return cart;
  }

  @HttpCode(200)
  @Post('add-to-cart')
  async addToCart(
    @CurrentUser('id') userID: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDocument> {
    return this.cartsService.addToCart(userID, addToCartDto);
  }

  @Patch('update-cart')
  async updateCartItemQuantity(
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser('id') userID: string,
  ): Promise<CartDocument> {
    const { productID, quantity } = updateCartDto;
    return this.cartsService.updateCartItemQuantity(
      userID,
      productID,
      quantity,
    );
  }

  @Patch('/delete-cart-item')
  async deleteCartItem(
    @CurrentUser('id') userID: string,
    @Body() deleteCartDto: DeleteCartDto,
  ): Promise<CartDocument> {
    return this.cartsService.deleteCartItem(userID, deleteCartDto.productID);
  }

  @HttpCode(204)
  @Delete('/delete-my-cart')
  async deleteMyCart(@CurrentUser('id') userID: string) {
    return await this.cartsService.deleteCart(userID);
  }
}
