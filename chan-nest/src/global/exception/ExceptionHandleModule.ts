import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptionFilter/HttpExceptionFilter';
import { PrismaClientExceptionFilter } from './exceptionFilter/PrismaClientExceptionFilter';
import { UsersExceptionFilter } from './exceptionFilter/UsersExceptionFilter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UsersExceptionFilter,
    },
  ],
})
export class ExceptionHandleModule {}
