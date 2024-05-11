import { PostSummaryDto } from './PostSummaryDto';

export interface PostPageDto {
  readonly postSummaries: PostSummaryDto[];
  readonly metadata: {
    readonly lastId: bigint;
  };
}
