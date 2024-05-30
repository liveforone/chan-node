export const PostUrl = {
  ROOT: 'posts',
  SEARCH_POSTS: 'search',
  DETAIL: ':id',
  UPDATE: ':id',
  REMOVE: ':id',
} as const;

export const PostParam = {
  KEYWORD: 'keyword',
  WRITER_ID: 'writer-id',
  ID: 'id',
} as const;
