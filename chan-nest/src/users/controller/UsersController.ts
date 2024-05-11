import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from '../service/UsersService';
import { SignupDto } from '../dto/request/SignupDto';
import { Public } from '../../auth/decorator/PublicDecorator';
import { UsersUrl } from './constant/UsersUrl';
import { UsersResponse } from './response/UsersResponse';
import { UpdatePwDto } from '../dto/request/UpdatePwDto';
import { WithdrawDto } from '../dto/request/WithdrawDto';

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
