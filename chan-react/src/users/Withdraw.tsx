import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { UsersServerApi } from '../api/users-server.api';
import { createAuthHeader } from '../api/util/create-auth-header';

const Withdraw = () => {
  const [userInput, setUserInput] = useState({
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
      .post(UsersServerApi.WITHDRAW, userInput, {
        headers: createAuthHeader(),
      })
      .then(() => {
        setIsSubmitted(true);
      })
      .catch(() => {
        alert('비밀번호가 틀렸습니다.');
      });
  };

  const confirmed = window.confirm('정말 탈퇴하시겠습니까?');

  if (!confirmed) {
    return (
      <div className="container">
        <h2>탈퇴가 취소되었습니다.</h2>
        <a href="/" className="btn btn-primary">
          홈으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      {!isSubmitted ? (
        <form onSubmit={submitHandler}>
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
          <button type="submit" className="btn btn-danger">
            탈퇴
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2>탈퇴 성공</h2>
          <p>안녕히 가세요</p>
          <a href="/" className="btn btn-primary">
            홈으로 돌아가기
          </a>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
