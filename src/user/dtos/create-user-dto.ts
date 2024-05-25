import { IsAlphanumeric, Length, MaxLength, MinLength } from 'class-validator';
import { IsEqual } from '../custom-decorators';
export class CreateUserDto {
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  userName: string;

  @IsAlphanumeric()
  @Length(8, 32)
  password: string;

  @IsEqual('password', { message: 'Passwords must match!' })
  passwordConfirm: string;
}
