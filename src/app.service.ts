import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersRepository } from './database/user.repository';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly userRepository: UsersRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    try {
      const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
      if (!ADMIN_USERNAME || !ADMIN_PASSWORD)
        throw new Error(
          'Missing environment variables ADMIN_USERNAME or ADMIN_PASSWORD',
        );
      const existingAdmin =
        await this.userRepository.findUserByUserName(ADMIN_USERNAME);
      if (existingAdmin) {
        console.log(
          `An admin with username: ${ADMIN_USERNAME}, already exists`,
        );
        return;
      }

      await this.userRepository.createUser({
        userName: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(
        'An admin user has been created depending on the environment variables.',
      );
    } catch (error) {
      console.error('Error during application bootstrap:', error.message);
      process.exit(1);
    }
  }
}
