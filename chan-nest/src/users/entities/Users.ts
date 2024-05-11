import { encodePassword } from 'src/auth/util/PasswordUtil';
import { UsersConstant } from './constant/UsersConstant';
import { $Enums } from '@prisma/client';

export class Users {
  username: string;
  password: string;
  role: $Enums.role;

  static async create(username: string, password: string) {
    const user = new Users();
    user.username = username;
    user.password = await encodePassword(password);
    user.role =
      username == UsersConstant.ADMIN_USERNAME
        ? $Enums.role.ADMIN
        : $Enums.role.MEMBER;
    return user;
  }
}
