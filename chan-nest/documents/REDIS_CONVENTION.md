# Redis 사용 전략 및 컨벤션

## Redis 모듈 및 provider 설계 상세

- `REDIS_CLIENT` provider를 모듈내에 로컬하게 선언하였다.
- 그리고 이 provider를 RedisService에서 생성자 주입하여 사용한다.
- 그리고 RedisModule을 전역(global)으로 선언하여 다른 모든 모듈에서 import하지 않고 사용할 수 있도록 한다.
- prisma도 그렇고 redis도 그렇고 모든 도메인에서 거의 사용하는 패키지인 만큼 global로 사용하는 것이 올바르다.
- 아래는 RedisModule 구현부이다.

```typescript
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT, // = 'REDIS_CLIENT'
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
```

## 데이터 조회시 redis 조회 및 캐싱

- 일반적으로 redis를 사용할때 다음과 같은 패턴을 사용한다.
- `get`메서드로 조회를 하고, 만약 `null`이 반환되면 db에서 조회를 하여 캐싱을 한다.
- 마치 아래와 같다.

```typescript
const redisKey = CacheKey.DETAIL + id; //id는 식별자
const cachedData = await this.redis.get(redisKey);

return isExistInRedis(cachedData)
  ? JSON.parse(cachedData)
  : await this.prisma.domain
      .findUnique({
        where: { id: id },
      })
      .then(async (data) => {
        validateFoundData(data);
        await this.redis.set(redisKey, JSON.stringify(data));
        await this.redis.expire(redisKey, REDIS_GLOBAL_TTL);
        return data;
      });
```

## 조회 및 캐싱 패턴의 단점

- 위와 같은 코드의 단점은 단 하나이다.
- 모든 도메인에서 조회 및 캐싱을 할때 저런 비슷한 코드를 계속 작성한다는 것이다.
- 사실상 타입과 조회 쿼리(prisma 호출 코드)만 달라질 뿐 이외의 틀은 똑같다.

## 추상화된 조회 및 캐싱 함수

- 따라서 이러한 문제를 해결하고자 추상화된 조회 및 캐싱 함수를 제작하였다.

```typescript
//구현
async getOrLoad<T>(
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

// 사용
async getPostById(id: bigint): Promise<PostInfo> {
  const postDetailKey = PostCacheKey.DETAIL + id;

  //prisma 데이터 조회 익명함수
  const findPostInfoById = async () => {
    return await this.prisma.post
        .findUnique({
          where: { id: id },
        })
        .then(async (postInfo) => {
          validateFoundData(postInfo);
          return postInfo;
        });
  };

  return await this.redisService.getValueFromRedisOrDB<PostInfo>(
    postDetailKey,
    findPostInfoById,
    REDIS_GLOBAL_TTL,
  );
}
```

- 앞으로는 위와 같이 리턴할 타입을 제네릭으로 주고,
- 캐시 키와, prisma에서 조회하는 코드를 익명 함수로 선언하여 매개변수로 주고,
- 마지막으로 expire ttl을 매개변수로 주면 된다.
- 주의 할 점은 prisma에서 조회하는 코드를 익명함수로 제공해야한다는 것이다.
