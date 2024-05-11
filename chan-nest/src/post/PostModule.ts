import { Module } from '@nestjs/common';
import { PostService } from './service/PostService';
import { PostController } from './controller/PostController';

@Module({
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
