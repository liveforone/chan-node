import { $Enums } from '@prisma/client';

//페이징용 dto
export interface PostInfo {
  readonly id: bigint;
  readonly title: string;
  readonly content: string;
  readonly post_state: $Enums.PostState;
  readonly writer_id: string;
  readonly created_date: Date;
}
