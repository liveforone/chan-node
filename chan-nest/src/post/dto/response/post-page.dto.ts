import { PostSummary } from './post-summary.dto';

export interface PostPageDto {
  readonly postSummaries: PostSummary[];
  readonly metadata: {
    readonly lastId: bigint;
  };
}
