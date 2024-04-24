export const PostClientApi = {
  BASE: 'http://localhost:3000',
  HOME: 'http://localhost:3000/posts', //query: lastId
  SEARCH: 'http://localhost:3000/posts/search', //query: keyword & lastId
  UPDATE: 'http://localhost:3000/posts/update/', //[PATCH] param : id
  DETAIL: 'http://localhost:3000/posts/', //param : id
} as const;
