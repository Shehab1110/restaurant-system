import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/user.schema';
import { UsersRepository } from 'src/database/user.repository';

export interface AuthenticatedUser {
  user: User;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: Partial<User>): Promise<object> {
    const newUser = await this.usersRepository.createUser(user);
    const token = await this.jwtService.signAsync({ userId: newUser.id });
    return { token };
  }

  async signIn(user: Partial<User>): Promise<AuthenticatedUser> {
    const foundUser = await this.usersRepository.findUserByUserName(
      user.userName,
      ['password'],
    );
    if (!foundUser || !(await foundUser.checkPassword(user.password)))
      throw new UnauthorizedException('Invalid email or password!');
    const token = await this.jwtService.signAsync({ userId: foundUser.id });
    const { password, ...userObj } = foundUser.toObject();
    return { user: userObj, token };
  }
}
