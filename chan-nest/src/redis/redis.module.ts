import { Global, Module } from '@nestjs/common';
import { RedisService } from './service/redis.service';
import { REDIS_CLIENT } from './constant/redis.constant';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = createClient({
          //아래 url은 개발 단계에서 사용된다.
          url: 'redis://default:159624@localhost:6379',
          // url: 'redis://default:159624@host.docker.internal:6379',
        });
        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
