import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvPath } from '../../global/constant/EnvPath';
import { UsersService } from '../../users/service/UsersService';
import { LoginDto } from '../dto/request/LoginDto';
import { AuthExcMsg } from 'src/global/exception/exceptionMessage/AuthExcMsg';
import { AuthServiceLog } from './log/AuthServiceLog';
import { TokenInfoDto } from '../dto/response/TokenInfoDto';
import { validateUserPassword } from 'src/users/validator/UsersValidator';
import { REDIS_REFRESH_TOKEN_TTL } from 'src/global/redis/constant/RedisConstant';
import { UsersCacheKey } from 'src/global/redis/key/UsersKey';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/global/redis/service/RedisService';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private redisService: RedisService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService
      .getOneByUsername(username)
      .then(async (user) => {
        await validateUserPassword(password, user.password);
        return user;
      });

    const id = user.id;
    const refreshTokenKey = UsersCacheKey.REFRESH_TOKEN + id;
    const refreshToken = await this.generateRefreshToken().then(
      async (refreshToken) => {
        await this.redisService.set(refreshTokenKey, refreshToken);
        await this.redisService.expire(
          refreshTokenKey,
          REDIS_REFRESH_TOKEN_TTL,
        );
        return refreshToken;
      },
    );
    this.logger.log(AuthServiceLog.SIGNIN_SUCCESS + username);

    return new TokenInfoDto(
      id,
      await this.generateAccessToken(id),
      refreshToken,
    );
  }

  async reissueJwtToken(id: string, refreshToken: string) {
    const refreshTokenKey = UsersCacheKey.REFRESH_TOKEN + id;
    const foundRefreshToken = await this.redisService.get(refreshTokenKey);

    if (foundRefreshToken == null || foundRefreshToken != refreshToken) {
      throw new UnauthorizedException(AuthExcMsg.REFRESH_TOKEN_IS_NOT_MATCH);
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get(EnvPath.SECRET_KEY),
      });
    } catch (err) {
      throw new UnauthorizedException(AuthExcMsg.REFRESH_TOKEN_IS_EXPIRE);
    }

    const reissuedRefreshToken = await this.generateRefreshToken().then(
      async (reissuedRefreshToken) => {
        await this.redisService.set(refreshTokenKey, reissuedRefreshToken);
        return reissuedRefreshToken;
      },
    );
    this.logger.log(AuthServiceLog.REISSUE_TOKEN_SUCCESS + id);

    return new TokenInfoDto(
      id,
      await this.generateAccessToken(id),
      reissuedRefreshToken,
    );
  }

  private createPayload(id: string) {
    return { sub: id };
  }

  private async generateAccessToken(id: string) {
    return await this.jwtService.signAsync(this.createPayload(id));
  }

  private async generateRefreshToken() {
    //payload에 아무것도 안 넣더라도 빈 객체를 넣어야 정상적으로 토큰이 만들어진다.
    return await this.jwtService.signAsync(
      {},
      {
        secret: this.configService.get(EnvPath.SECRET_KEY),
        expiresIn: this.configService.get(
          EnvPath.REFRESH_TOKEN_EXPIRATION_TIME,
        ),
      },
    );
  }

  async logout(id: string) {
    await this.redisService.del(UsersCacheKey.REFRESH_TOKEN + id);
    this.logger.log(AuthServiceLog.LOGOUT_SUCCESS + id);
  }
}
