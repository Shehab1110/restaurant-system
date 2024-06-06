import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  })
  name: string;

  @Prop({ required: true, enum: ['Pizza', 'Pasta', 'Burger'] })
  category: string;

  @Prop({ required: true, minlength: 10, maxlength: 200 })
  description: string;

  @Prop({ required: true, min: 1, max: 10000 })
  price: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 1, category: 1 }, { unique: true });
