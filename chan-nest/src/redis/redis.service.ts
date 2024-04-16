import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './constant/redis.constant';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private redis: RedisClientType,
  ) {}

  async getValueFromRedisOrDB<T>(
    cacheKey: string,
    findDataFromDB: () => Promise<T>,
    expiredTTL: number,
  ): Promise<T> {
    const cachedValue = await this.redis.get(cacheKey);

    if (cachedValue != null) {
      return JSON.parse(cachedValue);
    } else {
      const data = await findDataFromDB();
      await this.redis.set(cacheKey, JSON.stringify(data));
      await this.redis.expire(cacheKey, expiredTTL);
      return data;
    }
  }

  async get(cacheKey: string): Promise<string> {
    return await this.redis.get(cacheKey);
  }

  async set(cacheKey: string, value: any): Promise<string> {
    return await this.redis.set(cacheKey, value);
  }

  async expire(cacheKey: string, ttl: number) {
    await this.redis.expire(cacheKey, ttl);
  }

  async del(cacheKey: string) {
    await this.redis.del(cacheKey);
  }
}
