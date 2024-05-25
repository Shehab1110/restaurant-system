import { IsMongoId } from 'class-validator';

export class DeleteCartDto {
  @IsMongoId()
  productID: string;
}
