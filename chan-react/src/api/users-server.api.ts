export const UsersServerApi = {
  SIGNUP: 'http://localhost:8080/users/signup',
  LOGIN: 'http://localhost:8080/auth/login',
  LOGOUT: 'http://localhost:8080/auth/logout',
  REISSUE: 'http://localhost:8080/auth/reissue',
  UPDATE_PASSWORD: 'http://localhost:8080/users/update/password',
  WITHDRAW: 'http://localhost:8080/users/withdraw',
  PROFILE: 'http://localhost:8080/users/profile',
} as const;
