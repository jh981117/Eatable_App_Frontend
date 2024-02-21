import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import { jwtDecode } from "jwt-decode";

const MyHeader = () => {
  const navigate = useNavigate();
  const { auth, setAuth, updateProfile } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuth((prevAuth) => ({ ...prevAuth, isLoggedIn: false }));

      return;
    }
    updateProfile();
  }, []);

  const tempColor = (temperature) => {
    if (temperature >= 20) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070778358-1.png";
    } else if (temperature >= 10) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070780292-2.png";
    } else if (temperature >= 0) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070782389-3.png";
    } else if (temperature >= -10) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070790881-33.png";
    } else if (temperature >= -20) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070787692-22.png";
    } else if (temperature >= -30) {
      return "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708070784217-11.png";
    } else {
      return "Gray"; // 기본값은 회색
    }
  };
  console.log(auth);
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 토큰 정보를 서버로 전송하여 로그아웃 처리
      await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth(""); // 프로필 정보 초기화
      localStorage.removeItem("token"); // 토큰 삭제
      navigate("/home");
    } catch (error) {
      console.error("Error logging out:", error);
      // 로그아웃 중 에러가 발생할 경우 적절한 에러 처리를 수행합니다.
    }
  };

  // 네비바의 스타일을 설정합니다.
  const navbarStyle = {
    height: "60px", // 원하는 높이로 조정하세요
    display: "flex",
    alignItems: "center", // 세로 가운데 정렬
    // justifyContent: "space-between", // 요소 간 간격 조절
    padding: "0 20px", // 좌우 여백 추가
  };

  // 로그아웃 버튼의 스타일을 설정합니다.
  const logoutButtonStyle = {
    fontSize: "14px", // 원하는 글자 크기로 조정
    margin: "0", // 마진 없애기
    marginRight: "5px",
  };
  console.log(auth);



  return (
    <>
      <style>
        {`
      .navbar-custom {
  display: flex;
  justify-content: center;
  position: relative;
}

.navbar-nav-custom {
  position: absolute;
  right: 0;
}`}
      </style>
      <Navbar bg="light" variant="light" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708150496729-logo.png"
              style={{ width: "100px" }}
            />
          </Navbar.Brand>
          {/* Nav 컴포넌트에 사용자 정의 클래스 적용 */}
          <Nav className="navbar-nav-custom">
            {auth.isLoggedIn ? (
              <>
                {/* 로그인 했을 때 보여줄 링크들 */}
                <Nav.Link
                  as={Link}
                  to="/usermypage"
                  className="d-flex align-items-center"
                >
                  {/* 프로필 이미지, 닉네임, 로그아웃 버튼 등 */}
                </Nav.Link>
                <Button onClick={handleLogout} variant="outline-secondary">
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary">
                  로그인
                </Link>
                <Link to="/provision" className="btn btn-secondary">
                  회원가입
                </Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default MyHeader;
