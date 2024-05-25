import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product, ProductDocument } from './product.schema';
import { Query } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(product: Partial<Product>): Promise<ProductDocument> {
    return this.productRepository.createProduct(product);
  }

  getProducts(): Query<ProductDocument[], ProductDocument> {
    return this.productRepository.getProducts().lean();
  }
}
