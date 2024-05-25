import { IsAlphanumeric, Length, MaxLength, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsAlphanumeric()
  @Length(3, 20)
  userName: string;

  @IsAlphanumeric()
  @Length(8, 32)
  password: string;
}
