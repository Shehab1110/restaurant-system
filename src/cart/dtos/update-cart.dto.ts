import { IsInt, IsMongoId, Max, Min } from 'class-validator';

export class UpdateCartDto {
  @IsMongoId()
  productID: string;

  @IsInt()
  @Min(1, { message: 'Try deleting the cart item instead!' })
  @Max(10)
  quantity: number;
}
