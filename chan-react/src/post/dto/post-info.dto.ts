export interface PostInfo {
  readonly id: bigint;
  readonly title: string;
  readonly content: string;
  readonly post_state: string;
  readonly writer_id: string;
  readonly created_date: Date;
}
