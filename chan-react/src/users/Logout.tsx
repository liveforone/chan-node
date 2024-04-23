import { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isTokenExistInLocalstorage } from '../auth/check-token';
import { UsersServerApi } from '../api/users-server.api';
import { removeToken, removeUserId } from '../auth/remove-auth';
import { createAuthHeader } from '../api/util/create-auth-header';

const Logout = () => {
  const navigate = useNavigate();
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isTokenExistInLocalstorage()) {
      await axios
        .post(UsersServerApi.LOGOUT, {}, { headers: createAuthHeader() })
        .then((response) => {
          alert(response.data);
        })
        .catch(() => {
          alert('토큰이 유효하지 않습니다. 재로그인 후 시도해주세요');
        });

      removeToken();
      removeUserId();
    } else {
      alert('이미 로그아웃 되어있습니다.');
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="container">
      <h2>로그아웃 하시겠습니까?</h2>
      <form onSubmit={submitHandler}>
        <button type="submit" className="btn btn-primary">
          로그아웃
        </button>
      </form>
    </div>
  );
};

export default Logout;
