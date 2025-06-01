export const PostServerApi = {
  HOME: 'http://localhost:8080/posts', //query: lastId
  BELONG_WRITER: 'http://localhost:8080/posts', //param: writerId, query: lastId
  SEARCH: 'http://localhost:8080/posts/search', //query: keyword & lastId
  CREATE: 'http://localhost:8080/posts',
  DETAIL: 'http://localhost:8080/posts/', //param : id
  UPDATE: 'http://localhost:8080/posts/', //[PATCH] param : id
  REMOVE: 'http://localhost:8080/posts/', //param : id
} as const;
