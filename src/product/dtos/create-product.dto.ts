import {
  IsAlpha,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsAlpha()
  @IsEnum(['Pizza', 'Pasta', 'Burger'])
  category: string;

  @IsNumber()
  @Min(1)
  @Max(10000)
  price: number;

  @IsString()
  @Length(3, 200)
  description: string;
}
