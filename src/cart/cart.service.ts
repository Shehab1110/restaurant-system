import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { Cart, CartDocument, CartItem } from './cart.schema';
import { ProductRepository } from 'src/product/product.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from 'src/product/product.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly cartsRepository: CartRepository,
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    private readonly productsRepository: ProductRepository,
  ) {}

  async getMyCart(userID: string): Promise<CartDocument> {
    return this.cartsRepository.findCartByUserID(userID);
  }

  // async addToCart(
  //   userID: string,
  //   cartItem: { productID: string; quantity: number },
  // ): Promise<CartDocument> {
  //   // Find the product with the provided ID
  //   const product = await this.productsRepository.getProductByID(
  //     cartItem.productID,
  //   );
  //   // If there isnt a product throw an error
  //   if (!product)
  //     throw new BadRequestException('The provided product ID is not valid');
  //   // If there is indeed a product
  //   // Look for an existing user cart
  //   const cart = await this.cartsRepository.findCartByUserID(userID);
  //   // if there isnt a cart, create a new cart with the cart item
  //   if (!cart) {
  //     const { id, name, price } = product;
  //     return this.cartsRepository.createCart(userID, {
  //       product: {
  //         id,
  //         name,
  //         price,
  //       },
  //       quantity: cartItem.quantity,
  //     });
  //   }
  //   // if there is a cart, look for an existing cart item within the cart
  //   const index = cart.cartItems.findIndex(
  //     (item) => item.product.id === cartItem.productID,
  //   );
  //   // if there is an existing cart item, modify the quantity accordingly
  //   if (index !== -1) {
  //     const updatedCart = await this.cartModel
  //       .findByIdAndUpdate(
  //         cart.id,
  //         {
  //           $inc: {
  //             'cartItems.$[item].quantity': cartItem.quantity,
  //             totalPrice: product.price * cartItem.quantity,
  //           },
  //         },
  //         {
  //           arrayFilters: [{ 'item.product.id': cartItem.productID }],
  //           new: true,
  //         },
  //       )
  //       .lean();
  //     return updatedCart;
  //   }

  //   // if there isnt, directly push the cart item to the cartItems array
  //   cart.cartItems.push({
  //     product: {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //     },
  //     quantity: cartItem.quantity,
  //   });
  //   return await cart.save();
  // }

  async addToCart(
    userID: string,
    cartItem: { productID: string; quantity: number },
  ): Promise<CartDocument> {
    // Find the product with the provided ID
    const product = await this.productsRepository.getProductByID(
      cartItem.productID,
    );
    // If there isnt a product throw an error
    if (!product)
      throw new BadRequestException('The provided product ID is not valid');
    // If there is indeed a product
    // Look for an existing user cart
    const cart = await this.cartsRepository.findCartByUserID(userID);
    // if there isnt a cart, create a new cart with the cart item
    if (!cart) {
      const { id } = product;
      return this.cartModel.create({
        user: userID,
        cartItems: [{ product: id, quantity: cartItem.quantity }],
        totalPrice: (product.price * cartItem.quantity).toFixed(2),
      });
    }
    // if there is a cart, look for an existing cart item within the cart
    // Here, the product field is already populated
    const index = cart.cartItems.findIndex(
      (item) => (item.product as any)?.id === cartItem.productID,
    );
    console.log(index);
    // if there is an existing cart item, modify the quantity accordingly
    if (index !== -1) {
      cart.cartItems[index].quantity += cartItem.quantity;
      cart.$inc('totalPrice', product.price * cartItem.quantity);
      return cart.save();
    }

    // if there isnt, directly push the cart item to the cartItems array
    cart.cartItems.push({
      product: product.id,
      quantity: cartItem.quantity,
    });
    cart.totalPrice += product.price * cartItem.quantity;
    cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

    return (await cart.save()).populate('cartItems.product', 'id name price');
  }

  async updateCartItemQuantity(
    userID: string,
    productID: string,
    quantity: number,
  ): Promise<CartDocument> {
    return this.cartsRepository.updateCartItemQuantity(
      userID,
      productID,
      quantity,
    );
  }

  async deleteCartItem(
    userID: string,
    productID: string,
  ): Promise<CartDocument> {
    const cart = await this.cartsRepository.findCartByUserID(userID);
    if (!cart) throw new NotFoundException('There is no cart!');
    if (cart.cartItems.length === 0)
      throw new BadRequestException('The cart is empty!');

    // Cart.cartItems.product is already populated here...
    const index = cart?.cartItems.findIndex(
      (item) => (item.product as any)?.id === productID,
    );
    if (index > -1) {
      cart.cartItems.splice(index, 1);
      cart.totalPrice = parseFloat((await cart.calcTotalPrice()).toFixed(2));
      return cart.save();
    }
    throw new BadRequestException(
      'The provided product ID is not inside the cart!',
    );
  }

  async deleteCart(userID: string) {
    return this.cartsRepository.deleteCart(userID);
  }
}
