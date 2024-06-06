import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { ProductDocument } from '../../database/product.schema';
import { APIFeatures, QueryString } from 'src/utils/api-features';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(['admin'])
  @Post('/create-product')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(
    @Query() queryString: QueryString,
  ): Promise<ProductDocument[]> {
    const features = new APIFeatures(
      this.productService.getProducts(),
      queryString,
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();
    return await features.query;
  }
}
