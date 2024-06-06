import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
