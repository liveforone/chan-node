import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dto/request/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/request/update-post.dto';
import { RemovePostDto } from '../dto/request/remove-post.dto';
import { PostServiceLog } from '../log/post-service.log';
import { PostCacheKey } from 'src/redis/key/post-cache.key';
import { REDIS_GLOBAL_TTL } from 'src/redis/constant/redis.constant';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { validateFoundData } from 'src/common/found-data.validator';
import { findLastIdOrDefault, ltLastIdCondition } from 'prisma-no-offset';
import { PostSummary } from '../dto/response/post-summary.dto';
import { PostQueryConstant } from './constant/post-query.constant';
import { PostInfo } from '../dto/response/post-info.dto';
import { PostPageDto } from '../dto/response/post-page.dto';
import { RedisService } from 'src/redis/service/redis.service';

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
      data: PostEntity.create(title, content, writerId),
    });
    this.logger.log(PostServiceLog.CREATE_POST_SUCCESS + writerId);
  }

  async updateContent(updatePostDto: UpdatePostDto, id: bigint) {
    const { writerId, content } = updatePostDto;
    await this.prisma.post.update({
      data: { content: content, post_state: $Enums.PostState.EDITED },
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

  async getPostById(id: bigint): Promise<PostInfo> {
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

    return await this.redisService.getValueFromRedisOrDB<PostInfo>(
      postDetailKey,
      findPostInfoById,
      REDIS_GLOBAL_TTL,
    );
  }

  async getAllPosts(lastId?: bigint): Promise<PostPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostSummary[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
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
    const posts: PostSummary[] = await this.prisma.post.findMany({
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
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
    const posts: PostSummary[] = await this.prisma.post.findMany({
      where: { AND: [{ title: { startsWith: title } }, lastIdCondition] },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostQueryConstant.PAGE_SIZE,
    });

    return {
      postSummaries: posts,
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
  }
}
