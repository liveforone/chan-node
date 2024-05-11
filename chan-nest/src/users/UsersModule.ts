import { Module } from '@nestjs/common';
import { UsersService } from './service/UsersService';
import { UsersController } from './controller/UsersController';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
