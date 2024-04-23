import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/request/signup.dto';
import { Public } from '../../auth/decorator/public.decorator';
import { UsersUrl } from './constant/users-url.constant';
import { UsersResponse } from './response/users.response';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { WithdrawDto } from '../dto/request/withdraw.dto';

@Controller(UsersUrl.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post(UsersUrl.SIGNUP)
  async signup(@Body() signupDto: SignupDto) {
    await this.usersService.signup(signupDto);
    return UsersResponse.SIGNUP_SUCCESS;
  }

  @Patch(UsersUrl.UPDATE_PASSWORD)
  async updatePassword(@Body() updatePwDto: UpdatePwDto, @Request() req) {
    await this.usersService.updatePassword(updatePwDto, req.user.userId);
    return UsersResponse.UPDATE_PASSWORD_SUCCESS;
  }

  @Delete(UsersUrl.WITHDRAW)
  async withdraw(@Body() withdrawDto: WithdrawDto, @Request() req) {
    const id = req.user.userId;
    await this.usersService.withdraw(withdrawDto, id);
    return UsersResponse.WITHDRAW_SUCCESS;
  }

  @Get(UsersUrl.PROFILE)
  async getProfile(@Request() req) {
    return await this.usersService.getOneDtoById(req.user.userId);
  }
}
