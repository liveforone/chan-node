# passport 튜토리얼

## 현 프로젝트에서

- 현 프로젝트에서는 passport를 사용하지 않는다.
- 이를 사용하지 않고 복잡성을 대폭줄인 커스텀 auth guard를 이용하여 처리한다.
- 그러나 만약 passport 사용이 필요할 경우 아래의 튜토리얼을 보고 사용하면 된다.

## JwtGuard

- app module에 전역 가드로 설정한다.

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/PublicDecorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

## JwtStrategy

- auth module의 provider에 삽입한다.

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvPath } from 'src/global/constant/EnvPath';

@Injectable()
export class JwtStratey extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EnvPath.SECRET_KEY),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
```

## auth module

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './service/AuthService';
import { AuthController } from './controller/AuthController';
import { UsersModule } from '../users/UsersModule';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvPath } from '../global/constant/EnvPath';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvPath.SECRET_KEY),
        signOptions: {
          expiresIn: configService.get(EnvPath.ACCESS_TOKEN_EXIPIRATION_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```
