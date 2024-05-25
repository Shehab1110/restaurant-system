import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsMongoId()
  orderID: string;

  @IsMongoId()
  productID: string;

  @IsInt()
  @Min(1, { message: 'Try deleting the order item instead!' })
  @Max(10)
  quantity: number;
}
