import * as mongoose from 'mongoose';
import { RedisService } from './redis/redis.service';

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (
  opts: { key?: string; expiryTime?: number } = {},
) {
  this.shouldCached = true;
  this.primaryKey = opts.key || '';
  this.expiryTime = opts.expiryTime || 30;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.shouldCached) {
    return exec.apply(this, arguments);
  }

  const redisService = new RedisService();
  const client = redisService.getClient();

  const { primaryKey } = this;
  const key = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name,
  });
  const { expiryTime } = this;

  const cachedResult = await client.hGet(primaryKey, key);

  if (cachedResult) {
    console.log('Serving from cache!');
    const doc = JSON.parse(cachedResult);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  await client.hSet(primaryKey, key, JSON.stringify(result));
  await client.expire(primaryKey, expiryTime);

  return result;
};

export const clearCache = async (primaryKey: string) => {
  const redisService = new RedisService();
  const client = redisService.getClient();
  await client.del(JSON.stringify(primaryKey));
};
