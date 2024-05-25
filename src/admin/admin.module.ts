import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [UserModule, OrderModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
