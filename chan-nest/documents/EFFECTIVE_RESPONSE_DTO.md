# 효율적으로 Response dto 사용

## select 절과 dto

- response dto 는 클라이언트에게 전달하는 dto이다.
- 이는 db에서 조회한 최종적인 결과값에 1대1로 대응하는 경우가 굉장히 많다.
- 따라서 response dto는 재사용을 하더라도,
- select 절은 계속해서 똑같은 코드를 반복할 수 있게 된다.
- 따라서 select절을 생성하는 익명함수를 미리 정의해두고
- orm을 이용해서 쿼리를 날리때 select절에 함수를 호출하여 select 절의 중복을 막고 재사용성을 높일 수 있다.

## 예제

- UsersInfo는 response dto이다.
- 이를 조회하는 select절에 대한 익명함수를 만들었고
- 이를 아래와 같이 orm에서 사용한다.

```typescript
export interface UsersInfo {
  readonly id: string;
  readonly username: string;
  readonly role: $Enums.Role;
}

export const getUserInfoFields = () => {
  return {
    id: true,
    username: true,
    role: true,
  };
};

await this.prisma.users
  .findUnique({
    select: getUserInfoFields(), //select 절 생성 함수 호출
    where: { id: id },
  })
  .then(async (userInfo) => {
    validateFoundData(userInfo);
    return userInfo;
  });
```
