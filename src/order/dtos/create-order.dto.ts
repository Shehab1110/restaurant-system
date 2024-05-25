import { IsString, Length } from 'class-validator';

export class CreateOrderDto {
  // More realistic address validations need to be added
  @IsString()
  @Length(10, 50)
  address: string;
}
