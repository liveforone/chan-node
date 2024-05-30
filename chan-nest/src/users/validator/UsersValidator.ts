import { HttpStatus } from '@nestjs/common';
import { isMatchPassword } from 'src/auth/util/PasswordUtil';
import { UsersException } from 'src/global/exception/customException/UsersException';
import { UsersExcMsg } from 'src/global/exception/exceptionMessage/UsersExcMsg';

export const validateUserPassword = async (
  originalPw: string,
  encodedPw: string,
) => {
  if (!(await isMatchPassword(originalPw, encodedPw))) {
    throw new UsersException(
      UsersExcMsg.PASSWORD_IS_NOT_MATCH,
      HttpStatus.BAD_REQUEST,
    );
  }
};
