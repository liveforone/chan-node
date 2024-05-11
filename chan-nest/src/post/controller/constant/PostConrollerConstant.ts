export const PostUrl = {
  ROOT: 'posts',
  BELONG_WRITER: 'belong-writer/:writerId',
  SEARCH_POSTS: 'search',
  DETAIL: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;

export const PostParam = {
  KEYWORD: 'keyword',
  WRITER_ID: 'writerId',
  ID: 'id',
} as const;
