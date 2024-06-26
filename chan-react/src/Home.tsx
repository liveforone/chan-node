import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaComments } from 'react-icons/fa';

const Container = styled.div`
  text-align: center;
  padding: 50px;
  background-color: #f0f6fc;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #666;
  margin-bottom: 30px;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: #50575e;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 18px;
  transition: background-color 0.3s ease;
  margin-top: 20px; /* 각 링크 사이의 간격 */

  &:hover {
    background-color: #8c8f94;
  }
`;

const ProfileIcon = styled(FaUser)`
  margin-right: 10px;
`;

const PostIcon = styled(FaComments)`
  margin-right: 10px;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  return (
    <Container>
      <Title>간단한 소개</Title>
      <Subtitle>부제</Subtitle>
      <Description>상세 설명</Description>
      <VerticalContainer>
        <StyledLink to="/users/profile">
          <ProfileIcon /> 나의 프로필
        </StyledLink>
        <StyledLink to="/posts">
          <PostIcon /> 게시글
        </StyledLink>
      </VerticalContainer>
    </Container>
  );
};

export default Home;
