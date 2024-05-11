export class TokenInfoDto {
  readonly id: string;
  readonly accessToken: string;
  readonly refreshToken: string;

  constructor(id: string, accessToken: string, refreshToken: string) {
    this.id = id;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
