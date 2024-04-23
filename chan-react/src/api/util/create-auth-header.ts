import { AuthConstant } from '../../auth/constant/auth.constant';
import { getAccessToken } from '../../auth/get-auth';

export function createAuthHeader() {
  return { Authorization: AuthConstant.BEARER + getAccessToken() };
}
