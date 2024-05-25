import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model, Query } from 'mongoose';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(product: Partial<Product>): Promise<ProductDocument> {
    return this.productModel.create(product);
  }

  getProducts(): Query<ProductDocument[], ProductDocument> {
    return this.productModel.find({});
  }

  async getProductByID(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id);
  }
}
