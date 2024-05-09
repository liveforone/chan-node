# chan nest - backend boilerplate

- [chan nest - backend boilerplate](#chan-nest---backend-boilerplate)
  - [문서](#문서)
  - [file setting](#file-setting)
    - [.env 수정](#env-수정)
    - [ecosystem.config.js 수정](#ecosystemconfigjs-수정)
    - [users 도메인 수정](#users-도메인-수정)
  - [docker command](#docker-command)
  - [복합키](#복합키)
  - [n + 1 문제 해결](#n--1-문제-해결)
  - [프로젝트 유지보수](#프로젝트-유지보수)

## 문서

- [Redis 사용 전략 및 컨벤션](./documents/REDIS_CONVENTION.md)
- [response dto 주의사항](./documents/RESPONSE_DTO_CAUTION.md)
- [효율적으로 response dto 사용하기](./documents/EFFECTIVE_RESPONSE_DTO.md)

## file setting

### .env 수정

- DB_URL
- 시크릿 키 : `wsl openssl rand -hex 64`

### ecosystem.config.js 수정

- name을 docker container의 이름과 동일하게 한다.

### users 도메인 수정

- redis cache key
- users.constant의 admin_email 수정

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

## 프로젝트 유지보수

- `npx npm-check-updates -u -f "/nestjs*/"`
- `npm i typescript@<version>`
- `npm i reflect-metadata@<version>`
- `npm i prisma@latest`
- `npm i @prisma/client@latest`
- `npm i pg@latest`
- dev-dependencies는 건들지 않는게 좋다. 문제가 발생할경우 [nestjs의 package.json](https://github.com/nestjs/nest/blob/master/package.json)에 검색하여 적절한 버전을 파악하고, 해당 특정 버전으로 업데이트를 진행하라
