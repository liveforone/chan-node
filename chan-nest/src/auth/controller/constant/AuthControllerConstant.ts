export const AuthUrl = {
  ROOT: 'auth',
  LOGIN: 'login',
  REISSUE: 'reissue',
  LOGOUT: 'logout',
} as const;

export const AuthParam = {
  ID: 'id',
  REFRESH_TOKEN_HEADER: 'refresh-token',
} as const;
