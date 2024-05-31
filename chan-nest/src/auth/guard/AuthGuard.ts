import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/PublicDecorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthExcMsg } from 'src/global/exception/exceptionMessage/AuthExcMsg';
import { AuthGuardConstant } from './constant/AuthGuardConstant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request[AuthGuardConstant.USER] = { sub: decoded.sub };
      return true;
    } catch (error) {
      throw new UnauthorizedException(AuthExcMsg.INVALID_TOKEN);
    }
  }

  private extractToken(request: Request): string {
    const authHeader = request.headers[AuthGuardConstant.AUTHORIZATION];
    if (!authHeader) {
      throw new UnauthorizedException(AuthExcMsg.HEADER_NOT_FOUND);
    }

    const token = authHeader.split(AuthGuardConstant.EMPTY_STRING)[1];
    if (!token) {
      throw new UnauthorizedException(AuthExcMsg.TOKEN_NOT_FOUND);
    }

    return token;
  }
}
