import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { getUserId } from '../auth/get-auth';
import { getLastParam } from '../api/util/get-last-param';
import { PostServerApi } from '../api/post-server.api';
import { createAuthHeader } from '../api/util/create-auth-header';
import { PostClientApi } from '../api/post-client.api';
import { axiosErrorHandle } from '../error/axios.error-handle';

const UpdatePost = () => {
  const [updateData, setUpdateData] = useState({
    writerId: getUserId(),
    content: '',
  });

  const inputContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const param = getLastParam();
    await axios
      .patch(PostServerApi.UPDATE + param, updateData, {
        headers: createAuthHeader(),
      })
      .then((response) => {
        alert(response.data);
        window.location.replace(PostClientApi.DETAIL + param);
      })
      .catch((error: any) => {
        axiosErrorHandle(error);
      });
  };

  return (
    <div className="container">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="content">게시글</label>
          <textarea
            name="content"
            className="form-control"
            placeholder="게시글을 입력하세요."
            onChange={inputContentHandler}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          게시글 업데이트
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
