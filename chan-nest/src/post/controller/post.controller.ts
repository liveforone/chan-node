import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostUrl } from './constant/post-url.constant';
import { PostControllerConstant } from './constant/post-controller.constant';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { PostResponse } from './response/post.response';
import { LAST_ID } from 'prisma-no-offset';

@Controller(PostUrl.ROOT)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPostsPage(@Query(LAST_ID) lastId?: bigint) {
    return this.postService.getAllPosts(lastId);
  }

  @Get(PostUrl.BELONG_WRITER)
  async getBelongWriterPage(
    @Param(PostControllerConstant.WRITER_ID) writerId: string,
    @Query(LAST_ID) lastId?: bigint,
  ) {
    return await this.postService.getPostsByWriterId(writerId, lastId);
  }

  @Get(PostUrl.SEARCH_POSTS)
  async getSearchPostsPage(
    @Query(PostControllerConstant.KEYWORD) keyword: string,
    @Query(LAST_ID) lastId?: bigint,
  ) {
    return await this.postService.searchPostsByTitle(keyword, lastId);
  }

  @Get(PostUrl.DETAIL)
  async postDetailInfo(@Param(PostControllerConstant.ID) id: bigint) {
    return await this.postService.getPostById(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    await this.postService.createPost(createPostDto);
    return PostResponse.CREATE_POST_SUCCESS;
  }

  @Patch(PostUrl.UPDATE)
  async updatePost(
    @Param(PostControllerConstant.ID) id: bigint,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postService.updateContent(updatePostDto, id);
    return PostResponse.UPDATE_POST_SUCCESS;
  }

  @Delete(PostUrl.REMOVE)
  async removePost(
    @Param(PostControllerConstant.ID) id: bigint,
    @Body() removePostDto: RemovePostDto,
  ) {
    await this.postService.removePost(removePostDto, id);
    return PostResponse.DELETE_POST_SUCCESS;
  }
}
