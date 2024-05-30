import { Module } from '@nestjs/common';
import { AuthService } from './service/AuthService';
import { AuthController } from './controller/AuthController';
import { UsersModule } from '../users/UsersModule';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvPath } from '../global/constant/EnvPath';
import { JwtStratey } from './strategy/JwtStrategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  providers: [AuthService, JwtStratey],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
