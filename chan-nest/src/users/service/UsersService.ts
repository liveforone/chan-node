import { Injectable, Logger } from '@nestjs/common';
import { SignupDto } from '../dto/request/SignupDto';
import { UpdatePwDto } from '../dto/request/UpdatePwDto';
import { WithdrawDto } from '../dto/request/WithdrawDto';
import { UsersServiceLog } from './log/UsersServiceLog';
import { encodePassword } from 'src/auth/util/PasswordUtil';
import { validateUserPassword } from '../validator/UsersValidator';
import { UsersCacheKey } from 'src/redis/key/UsersKey';
import { REDIS_GLOBAL_TTL } from 'src/redis/constant/RedisConstant';
import { PrismaService } from 'src/prisma/PrismaService';
import { validateFoundData } from 'src/common/FoundDataUtil';
import { UsersInfoDto } from '../dto/response/UsersInfo';
import { RedisService } from 'src/redis/service/RedisService';
import { Users } from '../entities/Users';
import { users } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, password } = signupDto;
    const user = await Users.create(username, password);
    await this.prisma.users.create({ data: user });

    this.logger.log(UsersServiceLog.SIGNUP_SUCCESS + username);
  }

  async updatePassword(updatePwDto: UpdatePwDto, id: string) {
    const { originalPw, newPw } = updatePwDto;

    await this.prisma.$transaction(async (tx) => {
      await tx.users
        .findUnique({
          where: { id: id },
        })
        .then(async (user) => {
          validateFoundData(user);
          await validateUserPassword(originalPw, user.password);
        });

      await tx.users.update({
        data: { password: await encodePassword(newPw) },
        where: { id: id },
      });
    });

    this.logger.log(UsersServiceLog.UPDATE_PW_SUCCESS + id);
  }

  async withdraw(withdrawDto: WithdrawDto, id: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.users.findUnique({ where: { id: id } }).then(async (user) => {
        validateFoundData(user);
        await validateUserPassword(withdrawDto.password, user.password);
      });

      await tx.users.delete({ where: { id: id } });
    });

    await this.redisService.del(UsersCacheKey.USER_INFO + id);
    await this.redisService.del(UsersCacheKey.REFRESH_TOKEN + id);
    this.logger.log(UsersServiceLog.WITHDRAW_SUCCESS + id);
  }

  async getOneByUsername(username: string): Promise<users> {
    return await this.prisma.users
      .findUnique({
        where: { username: username },
      })
      .then((user) => {
        validateFoundData(user);
        return user;
      });
  }

  async getOneById(id: string): Promise<users> {
    return await this.prisma.users
      .findUnique({
        where: { id: id },
      })
      .then((user) => {
        validateFoundData(user);
        return user;
      });
  }

  async getOneDtoById(id: string): Promise<UsersInfoDto> {
    const userInfoKey = UsersCacheKey.USER_INFO + id;

    const findUsersInfoById = async () => {
      return await this.prisma.users
        .findUnique({
          omit: { password: true },
          where: { id: id },
        })
        .then(async (userInfo) => {
          validateFoundData(userInfo);
          return userInfo;
        });
    };

    return await this.redisService.getValueFromRedisOrDB<UsersInfoDto>(
      userInfoKey,
      findUsersInfoById,
      REDIS_GLOBAL_TTL,
    );
  }
}
