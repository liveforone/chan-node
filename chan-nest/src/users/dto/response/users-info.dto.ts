import { $Enums } from '@prisma/client';

export interface UsersInfo {
  readonly id: string;
  readonly username: string;
  readonly role: $Enums.Role;
}
