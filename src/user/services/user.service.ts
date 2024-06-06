import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../database/user.repository';
import { User, UserDocument } from '../../database/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(user: Partial<User>): Promise<UserDocument> {
    return this.usersRepository.createUser(user);
  }
}
