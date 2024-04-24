import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Home from './Home';
import Signup from './users/Signup';
import Login from './users/Login';
import Logout from './users/Logout';
import Profile from './users/Profile';
import Withdraw from './users/Withdraw';
import UpdatePassword from './users/UpdatePassword';
import CreatePost from './post/CreatePost';
import PostHome from './post/PostHome';
import PostDetail from './post/PostDetail';
import PostBelongWriter from './post/PostBelongWriter';
import PostSearch from './post/PostSearch';
import UpdatePost from './post/UpdatePost';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const Container = styled.div`
  background-color: #f0f6fc;
  min-height: 100vh;

  .container {
    max-width: 960px;
    margin: 0 auto;
  }

  .navbar {
    background-color: #e2edf7; /* 연한 파란색 */
    border-radius: 20px; /* 둥글게 만들기 */
    padding: 20px;
  }

  .navbar-brand {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  .navbar-nav .nav-item {
    margin-right: 10px;
  }

  .navbar-nav .nav-link {
    font-size: 18px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
  }

  .navbar-toggler {
    border: none;
  }

  hr {
    margin: 20px 0;
    border-color: #ddd;
  }
`;

function App() {
  return (
    <Container>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link to="/" className="navbar-brand">
            웹서비스 이름
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/users/signup" className="nav-link">
                  회원가입
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/login" className="nav-link">
                  로그인
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/profile" className="nav-link">
                  My
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users/withdraw" className="nav-link">
                  탈퇴
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <br />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/signup" element={<Signup />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/logout" element={<Logout />} />
          <Route path="/users/profile" element={<Profile />} />
          <Route path="/users/withdraw" element={<Withdraw />} />
          <Route path="/users/update/password" element={<UpdatePassword />} />
          <Route path="/posts" element={<PostHome />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/posts/belong-writer/:writerId"
            element={<PostBelongWriter />}
          />
          <Route path="/posts/search" element={<PostSearch />} />
          <Route path="/posts/update/:id" element={<UpdatePost />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
