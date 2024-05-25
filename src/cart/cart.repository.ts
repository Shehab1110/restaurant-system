import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument, CartItem } from './cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  async createCart(
    userID: string,
    cartItem: { product: string; quantity: number },
  ): Promise<CartDocument> {
    return this.cartModel.create({
      user: userID,
      cartItems: [cartItem],
    });
  }

  async findCartByUserID(userID: string): Promise<CartDocument> {
    return this.cartModel.findOne({
      user: userID,
    });
  }

  async updateCartItemQuantity(
    userID: string,
    productID: string,
    quantity: number,
  ): Promise<CartDocument> {
    const updatedCart = await this.cartModel.findOneAndUpdate(
      {
        user: userID,
      },
      {
        $set: { 'cartItems.$[item].quantity': quantity },
      },
      {
        arrayFilters: [{ 'item.product': productID }],
        new: true,
      },
    );
    if (!updatedCart) throw new NotFoundException('There is no existing cart!');
    if (
      updatedCart.cartItems.every(
        (item) => item.product.toString() !== productID,
      )
    )
      throw new BadRequestException(
        'No matching product with product ID within the cart',
      );

    updatedCart.totalPrice = parseFloat(
      (await updatedCart.calcTotalPrice()).toFixed(2),
    );
    return updatedCart.save();
  }

  async deleteCart(userID: string): Promise<void> {
    await this.cartModel.findOneAndDelete({
      user: userID,
    });
  }
}
