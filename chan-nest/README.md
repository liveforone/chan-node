# chan nest - backend boilerplate

- [chan nest - backend boilerplate](#chan-nest---backend-boilerplate)
  - [문서](#문서)
  - [project initializing](#project-initializing)
    - [.env 수정](#env-수정)
    - [ecosystem.config.js 수정](#ecosystemconfigjs-수정)
    - [users 도메인 수정](#users-도메인-수정)
    - [prisma initializing](#prisma-initializing)
  - [docker command](#docker-command)
  - [복합키](#복합키)
  - [n + 1 문제 해결](#n--1-문제-해결)
  - [dto의 구조](#dto의-구조)
  - [prisma omit](#prisma-omit)
  - [프로젝트 유지보수](#프로젝트-유지보수)
  - [주의사항](#주의사항)

## 문서

- [Redis 사용 전략 및 컨벤션](./documents/REDIS_CONVENTION.md)
- [response dto 주의사항](./documents/RESPONSE_DTO_CAUTION.md)
- [효율적으로 response dto 사용하기](./documents/EFFECTIVE_RESPONSE_DTO.md)
- [passport 튜토리얼(해당 프로젝트는 passport 사용안함)](./documents/USE_PASSPORT.md)

## project initializing

### .env 수정

- DB_URL
- 시크릿 키 : `wsl openssl rand -hex 64`

### ecosystem.config.js 수정

- name을 docker container의 이름과 동일하게 한다.

### users 도메인 수정

- redis cache key
- users.constant의 admin_email 수정

### prisma initializing

- `npx prisma generate`
- `npx prisma migrate deploy`
- `npx prisma db push`

## docker command

- 이미지 빌드 : `docker build --tag 이름:1.0 .`
- 이미지 확인 : `docker image ls`
- 이미지 배포 : `docker push 계정/이미지`
- 컨테이너 실행 : `docker run -p 8080:8080 -d 컨테이너이름`
- pm2 list : `docker exec -it 컨테이너ID pm2 list`
- pm2 kill : `docker exec -it {컨테이너이름} pm2 kill`
- pm2 log : `docker exec -it {컨테이너이름} pm2 log 모듈에서 붙인 이름`

## 복합키

```prisma
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

## n + 1 문제 해결

- fluent api 를 사용한다.
- 스키마에 연관관계 설정이 되어있어야한다.
- `findFirst`나 `findUnique`와 같은 단건 조회 api를 이용해야한다.

```typescript
//users를 기준으로 post를 가져온다.(one to many 관계에서 조회 -> n+1문제 발생)
//fluent api를 통해서 n+1문제 해결
const posts: Post[] = await prisma.user
  .findUniuqe({ where: { id: '1' } })
  .post(); //post는 users 스키마에 정의된 연관관계 post 이름
```

## dto의 구조

- dto의 구조를 고를 때 class, type, interface 중 고민하게 될 것이다.
- type과 interface는 런타임시 제거된다. 따라서 request dto로는 적합하지 않다.
- 그리고 request dto와 response dto의 구조가 통일되지 않는 것은 좋지 않으므로 class로 dto의 구조를 통일하는 것이 적절하다.

## prisma omit

- prisma 5.13.0 부터 추가된 `omit api`는 기존의 dto projection을 위한 `include`와 달리, 필요없는 필드를 기재하고, 이외의 모든 필드를 가져오는 api이다.
- schema.prisma의 generator에 `previewFeatures = ["omitApi"]`를 추가한다.
- 그리고 아래와 같이 사용한다.

```typescript
await prisma.user.findMany({
  omit: {
    password: true,
  },
});
```

- 특장점은 `include` api와 `omit`필드를 같이 사용할 수 있다는 점이다.

## 프로젝트 유지보수

- `npx npm-check-updates -u -f "/nestjs*/"`
- `npm i typescript@<version>`
- `npm i reflect-metadata@<version>`
- `npm i prisma@latest`
- `npm i @prisma/client@latest`
- `npm i pg@latest`
- `npm i prisma-no-offset@latest`
- `npm i prisma-common-error-handle@latest`
- dev-dependencies는 건들지 않는게 좋다. 문제가 발생할경우 [nestjs의 package.json](https://github.com/nestjs/nest/blob/master/package.json)에 검색하여 적절한 버전을 파악하고, 해당 특정 버전으로 업데이트를 진행하라

## 주의사항

- 백엔드가 많이 바뀌었다. 특히 lastId가 lastId에서 last-id로 바뀌는 변화 때문에 프론트의 post 관련 페이지는 대부분 동작하지 않을 것이다.
- 스프링과 다르게 쿼리스트링을 반드시 삽입해야한다. 이게 없으면 에러가 발생한다. 그러나 express-nestjs만 그렇고 fastify-nestjs는 직접 테스트해봐야한다.
