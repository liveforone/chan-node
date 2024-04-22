import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { UsersApi } from '../api/users.api';
import { axiosErrorHandle } from '../error/axios.error-handle';

const Signup = () => {
  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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
      .post(UsersApi.SIGNUP, userInput)
      .then((response) => {
        alert(response.data);
        setIsSubmitted(true);
      })
      .catch((error) => {
        axiosErrorHandle(error);
      });
  };

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
              placeholder="이메일을 입력하세요"
              onChange={userInputHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="비밀번호를 입력하세요"
              onChange={userInputHandler}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            회원가입
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2>회원가입 성공</h2>
          <a href="/" className="btn btn-link">
            홈으로 돌아가기
          </a>
        </div>
      )}
    </div>
  );
};

export default Signup;
