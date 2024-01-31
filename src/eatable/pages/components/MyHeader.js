import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import { jwtDecode } from "jwt-decode";

const MyHeader = () => {
  const { auth, setAuth } = useAuth();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      setAuth({
        isLoggedIn: true,
        user: {
          nickName: decodedToken.nickName,
          // 다른 필요한 정보들...
        },
      });
    } catch (error) {
      console.error("토큰 디코딩 오류", error);
      // 유효하지 않은 토큰 처리
    }
  } else {
    // 토큰이 없는 경우 초기에 로그아웃 상태로 설정
    setAuth({ isLoggedIn: false, user: null });
  }
}, []);

console.log("auth.isLoggedIn:", auth.isLoggedIn);
console.log("auth.user:", auth.user);
  console.log(setAuth)


  const handleLogout = () => {
    setAuth({ isLoggedIn: false, user: null });
    localStorage.removeItem("token");
  };

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Logo
        </Navbar.Brand>

        <Nav className="ml-auto">
          {auth.isLoggedIn ? (
            <>
              <div className="profile-circle"></div> {/* 프로필 이미지 표시 */}
              <span className="nickname">
                {auth.user ? auth.user.nickName : "로그인 필요"}
              </span>
              {/* 사용자 닉네임 표시 */}
              <Button onClick={handleLogout} variant="outline-secondary">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-secondary">
                로그인
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                회원가입
              </Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyHeader;
