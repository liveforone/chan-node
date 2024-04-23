import axios from 'axios';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AuthConstant } from '../auth/constant/auth.constant';
import { TokenInfo } from './dto/token-info.dto';
import { UsersServerApi } from '../api/users-server.api';
import { axiosErrorHandle } from '../error/axios.error-handle';
import { setUserAuth } from '../auth/set-auth';
import { UsersClientApi } from '../api/users-client.api';

const Login = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
  });

  const userInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios
      .post<TokenInfo>(UsersServerApi.LOGIN, userInput)
      .then((response) => {
        localStorage.setItem(AuthConstant.USER_ID, response.data.id);
        localStorage.setItem(
          AuthConstant.ACCESS_TOKEN,
          response.data.accessToken,
        );
        localStorage.setItem(
          AuthConstant.REFRESH_TOKEN,
          response.data.refreshToken,
        );
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
    setIsSubmitted(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await setUserAuth();
      if (isAuthenticated) {
        window.location.replace(UsersClientApi.PROFILE);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="container">
      {!isSubmitted ? (
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="username">이메일</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={userInputHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={userInputHandler}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            로그인
          </button>
        </form>
      ) : (
        <div>
          <h2>환영합니다!</h2>
          <a href="/users/profile" className="btn btn-primary">
            프로필
          </a>
        </div>
      )}
    </div>
  );
};

export default Login;
