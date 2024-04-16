export const PostUrl = {
  ROOT: 'posts',
  BELONG_WRITER: 'belong-writer/:writerId',
  SEARCH_POSTS: 'search',
  DETAIL: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;
