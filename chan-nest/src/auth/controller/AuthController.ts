import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthParam, AuthUrl } from './constant/AuthControllerConstant';
import { AuthService } from '../service/AuthService';
import { Public } from '../decorator/PublicDecorator';
import { LoginDto } from '../dto/request/LoginDto';
import { AuthResponse } from './response/AuthResponse';
import { User } from '../decorator/UserDecorator';

@Controller(AuthUrl.ROOT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post(AuthUrl.LOGIN)
  async login(@Body() loginRequest: LoginDto) {
    const tokenInfo = await this.authService.signIn(loginRequest);
    return tokenInfo;
  }

  @Public()
  @Post(AuthUrl.REISSUE)
  async reissueJwtToken(@Request() req) {
    const tokenInfo = await this.authService.reissueJwtToken(
      req.headers[AuthParam.ID],
      req.headers[AuthParam.REFRESH_TOKEN_HEADER],
    );
    return tokenInfo;
  }

  @Post(AuthUrl.LOGOUT)
  async logout(@User() user: any) {
    await this.authService.logout(user.sub);
    return AuthResponse.LOGOUT_SUCCESS;
  }
}
