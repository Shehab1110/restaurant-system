import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateOrderStatusDto {
  @IsMongoId()
  orderID: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'shipped', 'completed', 'cancelled'], {
    message: `Status must be of the following: ['pending', 'paid', 'shipped', 'completed', 'cancelled']`,
  })
  status: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Max decimal places are 2' })
  @Min(10)
  @Max(1000)
  totalPrice: number;

  // More realistic address validations need to be added
  @IsOptional()
  @IsString()
  @Length(10, 50)
  address: string;
}
