import axios from 'axios';
import { AuthConstant } from '../auth/constant/auth.constant';
import { UsersApi } from '../api/users.api';
import { TokenInfo } from '../users/dto/token-info.dto';
import { getRefreshToken, getUserId } from '../auth/get-auth';

function extractUrlInError(error: any) {
  return error.config.url.replace(/^https?:\/\/localhost:8080/g, '');
}

const baseFEUrl = 'http://localhost:3000';

export async function axiosErrorHandle(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      const foundRefreshToken = getRefreshToken();
      const userId = getUserId();
      await axios
        .post<TokenInfo>(
          UsersApi.REISSUE,
          {},
          {
            headers: { id: userId, 'refresh-token': foundRefreshToken },
          },
        )
        .then((response) => {
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          localStorage.setItem(AuthConstant.ACCESS_TOKEN, accessToken);
          localStorage.setItem(AuthConstant.REFRESH_TOKEN, refreshToken);
        })
        .catch(() => {
          console.log('Refresh Token 만료');
          alert('토큰이 만료되었습니다. 재로그인 해주세요');
          window.location.replace(UsersApi.BASE_URL + '/login');
        });
    } else {
      alert(error.response?.data.message);
      const errorUrl = extractUrlInError(error);
      window.location.replace(baseFEUrl + errorUrl);
    }
  }
}