import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/order/order.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [UserModule, OrderModule, RedisModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
