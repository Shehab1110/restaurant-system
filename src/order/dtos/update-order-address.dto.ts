import { IsMongoId, IsString, Length } from 'class-validator';

export class UpdateOrderAddersDto {
  @IsMongoId()
  orderID: string;

  // More realistic address validations need to be added
  @IsString()
  @Length(10, 50)
  address: string;
}
