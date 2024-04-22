import axios from 'axios';
import { AuthConstant } from './constant/auth.constant';
import { axiosErrorHandle } from '../error/axios.error-handle';
import { isTokenExistInLocalstorage } from './check-token';
import { UsersApi } from '../api/users.api';
import { getAccessToken } from './get-auth';

export async function setUserAuth() {
  if (isTokenExistInLocalstorage()) {
    try {
      const response = await axios.get(UsersApi.USER_INFO, {
        headers: { Authorization: AuthConstant.BEARER + getAccessToken() },
      });
      localStorage.setItem(AuthConstant.USER_ID, response.data.id);
      return true;
    } catch (error) {
      axiosErrorHandle(error);
    }
    return true;
  }
  return false;
}
