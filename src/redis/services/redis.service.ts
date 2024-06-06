import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: redis.RedisClientType;

  async onModuleInit() {
    this.client = redis.createClient({ url: 'redis://127.0.0.1:6379' });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): redis.RedisClientType {
    return this.client;
  }

  async flushAll(): Promise<void> {
    await this.client.flushAll();
  }
}
