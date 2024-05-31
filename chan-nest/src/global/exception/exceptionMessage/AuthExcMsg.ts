export enum AuthExcMsg {
  INVALID_TOKEN = 'Invalid token',
  HEADER_NOT_FOUND = 'Authorization header not found',
  TOKEN_NOT_FOUND = 'Jwt Token not found',
  REFRESH_TOKEN_IS_NOT_MATCH = 'Refresh 토큰이 일치하지 않습니다.',
  REFRESH_TOKEN_IS_EXPIRE = 'Refresh 토큰이 만료되었습니다. 재로그인 해주세요.',
}
