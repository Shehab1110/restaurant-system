import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Req } from 'src/request-interface';
import { Roles } from 'src/user/roles.decorator';
import { UsersRepository } from 'src/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const requiredRoles = this.reflector.getAllAndOverride(Roles, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!token) throw new UnauthorizedException('Please login to get access!');
    try {
      const { userId } = await this.jwtService.verifyAsync(token);
      const user = await this.usersRepository.findUserById(userId);
      if (!user)
        throw new UnauthorizedException(
          'The user of this token does not exist anymore!',
        );
      if (!requiredRoles || requiredRoles?.includes(user.role))
        (request as Req)['user'] = user;
      else
        throw new UnauthorizedException(
          'You do not have permissions to perform such a request!',
        );
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) throw err;
      else throw new UnauthorizedException('Malformed JWT!');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
