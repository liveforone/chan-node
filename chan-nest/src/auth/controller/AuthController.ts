import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthParam, AuthUrl } from './constant/AuthControllerConstant';
import { AuthService } from '../service/AuthService';
import { Public } from '../decorator/PublicDecorator';
import { LoginDto } from '../dto/request/LoginDto';
import { AuthResponse } from './response/AuthResponse';

@Controller(AuthUrl.ROOT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post(AuthUrl.LOGIN)
  async login(@Body() loginRequest: LoginDto) {
    const tokenInfo = await this.authService.signIn(loginRequest);
    return tokenInfo;
  }

  /*
  id를 any로 받은 이유는 { "id": "value" } 형태로 입력받기 위함이다.
  */
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
  async logout(@Request() req) {
    await this.authService.logout(req.user.userId);
    return AuthResponse.LOGOUT_SUCCESS;
  }
}
