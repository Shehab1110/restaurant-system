import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'logging.interceptor';
import { ResponseWrapperInterceptor } from 'responseWrapperInterceptor';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.DATABASE}`,
      }),
    }),
    AuthModule,
    OrderModule,
    ProductModule,
    CartModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
  ],
})
export class AppModule {}
