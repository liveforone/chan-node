import { $Enums } from '@prisma/client';

export interface UsersInfoDto {
  readonly id: string;
  readonly username: string;
  readonly role: $Enums.role;
}
