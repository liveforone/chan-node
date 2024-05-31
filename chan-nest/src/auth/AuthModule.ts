import { Module } from '@nestjs/common';
import { AuthService } from './service/AuthService';
import { AuthController } from './controller/AuthController';
import { UsersModule } from '../users/UsersModule';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvPath } from '../global/constant/EnvPath';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvPath.SECRET_KEY),
        signOptions: {
          expiresIn: configService.get(EnvPath.ACCESS_TOKEN_EXIPIRATION_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
