import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CartItem as OrderItem } from 'src/cart/cart.schema';
import { Product } from 'src/product/product.schema';
export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
      },
    ],
    _id: false,
  })
  orderItems: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  address: string;

  async calcTotalPrice() {
    let totalPrice = 0;
    await this.populate('orderItems.product', 'price');
    this?.orderItems.forEach((item) => {
      item.product as unknown;
      if (item.product instanceof Product)
        totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ user: 1 });

OrderSchema.methods.calcTotalPrice = async function () {
  let totalPrice = 0;
  await this.populate('orderItems.product', 'price');
  this?.orderItems.forEach((item: OrderItem) => {
    totalPrice += item.product.price * item.quantity;
  });
  return totalPrice;
};

OrderSchema.pre('find', function (next) {
  this.populate('orderItems.product', 'id name price');
  next();
});

OrderSchema.pre('findOne', function (next) {
  this.populate('orderItems.product', 'id name price');
  next();
});
