import { IsMongoId } from 'class-validator';

export class CancelOrderDto {
  @IsMongoId()
  orderID: string;
}
