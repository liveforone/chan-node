import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './global/prisma/PrismaModule';
import { RedisModule } from './global/redis/RedisModule';
import { ExceptionHandleModule } from './global/exception/ExceptionHandleModule';
import { AuthModule } from './auth/AuthModule';
import { UsersModule } from './users/UsersModule';
import { APP_GUARD } from '@nestjs/core';
import { PostModule } from './post/PostModule';
import { AuthGuard } from './auth/guard/AuthGuard';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    ExceptionHandleModule,
    AuthModule,
    UsersModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
