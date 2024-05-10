import { HttpException, HttpStatus } from '@nestjs/common';

export function validateFoundData<T>(foundData: T): void {
  if (!foundData) {
    throw new HttpException(
      'Record Is Not Exist In Database',
      HttpStatus.NOT_FOUND,
    );
  }
}
