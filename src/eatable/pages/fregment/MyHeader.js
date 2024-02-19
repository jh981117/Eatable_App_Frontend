import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";

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
  const handleLogout = () => {
    setAuth(""); // 프로필 정보도 초기화
    localStorage.removeItem("token");
    navigate("/home");

    // 필요한 경우 localStorage에서 다른 인증 관련 데이터도 제거
  };

  // 네비바의 스타일을 설정합니다.
  const navbarStyle = {
    height: "60px", // 원하는 높이로 조정하세요
    display: "flex",
    alignItems: "center", // 세로 가운데 정렬
    justifyContent: "space-between", // 요소 간 간격 조절
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
    <Navbar bg="light" variant="light" style={navbarStyle}>
      <Container>
        <Navbar.Brand as={Link} to="/home">
          <Image src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708150496729-logo.png"
          style={{width: "100px"}} />
        </Navbar.Brand>
        <Nav className="ml-auto">
          {auth.isLoggedIn ? (
            <>
              {/* 로그인 했을 때 보여줄 링크들 */}
              <Link to={"/reservation"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  예약페이지
                </Button>
              </Link>
              <Link to={"/partnerlist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  파트너페이지
                </Button>
              </Link>
              <Link to={"/userDetail"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  유저디테일
                </Button>
              </Link>
              <Link to={"/applyreq"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  업체신청등록
                </Button>
              </Link>
              <Link to={"/applylist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  어드민페이지
                </Button>
              </Link>
              <Link to={"/reviewlist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  리뷰리스트
                </Button>
              </Link>
              <Nav.Link
                as={Link}
                to="/usermypage"
                className="d-flex align-items-center"
              >
                <Image
                  src={auth.profile?.profileImageUrl}
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    maxWidth: "40px",
                    height: "40px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                />
                <span className="nickname ml-2">
                  {auth.profile ? auth.profile.nickName : ""}
                </span>

                <span style={{ marginRight: "5px" }}>
                  <Image
                    src={tempColor(
                      auth.profile ? auth.profile.temperature + 10 : ""
                    )}
                    style={{ width: "20px" }}
                  />
                  {auth.profile ? auth.profile.temperature + 10 : ""}º
                </span>
              </Nav.Link>

              <Button
                onClick={handleLogout}
                variant="outline-secondary"
                style={logoutButtonStyle}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              {/* 로그인하지 않았을 때 보여줄 링크들 */}
              <Link to={"/reservation"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  예약페이지
                </Button>
              </Link>
              <Link to={"/partnerlist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  파트너페이지
                </Button>
              </Link>
              <Link to={"/userDetail"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  유저디테일
                </Button>
              </Link>
              <Link to={"/applyreq"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  업체신청등록
                </Button>
              </Link>
              <Link to={"/applylist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  어드민페이지
                </Button>
              </Link>
              <Link to={"/reviewlist"}>
                <Button variant="outline-secondary" style={logoutButtonStyle}>
                  리뷰리스트
                </Button>
              </Link>
              <Link
                to="/usermypage"
                className="d-flex align-items-center"
              ></Link>

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
  );
};

export default MyHeader;
