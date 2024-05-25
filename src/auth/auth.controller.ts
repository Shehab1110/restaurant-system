import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/create-user-dto';
import { AuthService, AuthenticatedUser } from './auth.service';
import { SignInUserDto } from 'src/user/dtos/signin-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() user: CreateUserDto): Promise<object> {
    return this.authService.signUp(user);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInUserDto): Promise<AuthenticatedUser> {
    return this.authService.signIn(user);
  }
}
