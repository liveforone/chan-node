import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dto/request/CreatePostDto';
import { Post } from '../entities/Post';
import { UpdatePostDto } from '../dto/request/UpdatePostDto';
import { RemovePostDto } from '../dto/request/RemovePostDto';
import { PostServiceLog } from './log/PostServiceLog';
import { PostCacheKey } from 'src/redis/key/PostKey';
import { REDIS_GLOBAL_TTL } from 'src/redis/constant/RedisConstant';
import { PrismaService } from 'src/prisma/PrismaService';
import { $Enums } from '@prisma/client';
import { validateFoundData } from 'src/common/FoundDataUtil';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { PostSummaryDto } from '../dto/response/PostSummaryDto';
import { PostQueryConstant } from './constant/PostQueryConstant';
import { PostInfoDto } from '../dto/response/PostInfoDto';
import { PostPageDto } from '../dto/response/PostPageDto';
import { RedisService } from 'src/redis/service/RedisService';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { writerId: writerId, title, content } = createPostDto;
    await this.prisma.post.create({
      data: Post.create(title, content, writerId),
    });
    this.logger.log(PostServiceLog.CREATE_POST_SUCCESS + writerId);
  }

  async updateContent(updatePostDto: UpdatePostDto, id: bigint) {
    const { writerId, content } = updatePostDto;
    await this.prisma.post.update({
      data: { content: content, post_state: $Enums.post_state.EDITED },
      where: { id: id, writer_id: writerId },
    });
    await this.redisService.del(PostCacheKey.DETAIL + id);
    this.logger.log(PostServiceLog.UPDATE_POST_SUCCESS + id);
  }

  async removePost(removePostDto: RemovePostDto, id: bigint) {
    await this.prisma.post.delete({
      where: { id: id, writer_id: removePostDto.writerId },
    });
    await this.redisService.del(PostCacheKey.DETAIL + id);
    this.logger.log(PostServiceLog.REMOVE_POST_SUCCESS + id);
  }

  async getPostById(id: bigint): Promise<PostInfoDto> {
    const postDetailKey = PostCacheKey.DETAIL + id;

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

    return await this.redisService.getOrLoad<PostInfoDto>(
      postDetailKey,
      findPostInfoById,
      REDIS_GLOBAL_TTL,
    );
  }

  async getAllPosts(lastId?: bigint): Promise<PostPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostSummaryDto[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      omit: { content: true, post_state: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postSummaries: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async getPostsByWriterId(
    writerId: string,
    lastId: bigint,
  ): Promise<PostPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostSummaryDto[] = await this.prisma.post.findMany({
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      omit: { content: true, post_state: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postSummaries: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }

  async searchPostsByTitle(
    title: string,
    lastId: bigint,
  ): Promise<PostPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostSummaryDto[] = await this.prisma.post.findMany({
      where: { AND: [{ title: { startsWith: title } }, lastIdCondition] },
      omit: { content: true, post_state: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postSummaries: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }
}
