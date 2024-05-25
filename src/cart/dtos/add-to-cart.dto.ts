import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  productID: string;
  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;
}
