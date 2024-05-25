import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/product/product.schema';

export type CartDocument = Cart & Document;
export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: mongoose.Schema.Types.ObjectId;

  // @Prop()
  // cartItems: {
  //   product: {
  //     id: string;
  //     name: string;
  //     price: number;
  //   };
  //   quantity: number;
  // }[];

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
    _id: false,
  })
  cartItems: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ default: 1 })
  totalPrice: number;

  async calcTotalPrice() {
    let totalPrice = 0;
    await this.populate('cartItem.product', 'price');
    this?.cartItems.forEach((item) => {
      item.product as unknown;
      if (item.product instanceof Product)
        totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
  }
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Preventing duplicate carts
CartSchema.index({ user: 1 }, { unique: true });

CartSchema.methods.calcTotalPrice = async function () {
  let totalPrice = 0;
  await this.populate('cartItems.product', 'price');
  this?.cartItems.forEach((item: CartItem) => {
    totalPrice += item.product.price * item.quantity;
  });
  return totalPrice;
};

// CartSchema.pre('save', function (next) {
//   this.totalPrice = this.calcTotalPrice();
//   next();
// });

CartSchema.pre('findOne', function (next) {
  this.populate('cartItems.product', 'id name price');
  next();
});
