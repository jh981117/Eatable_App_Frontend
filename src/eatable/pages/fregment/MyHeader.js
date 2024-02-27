import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import { jwtDecode } from "jwt-decode";
import fetchWithToken from "../../rolecomponents/FetchCustom";

const MyHeader = () => {
  const navigate = useNavigate();
  const { auth, setAuth, updateProfile } = useAuth();
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

const refreshToken = async () => {
  const storedToken = localStorage.getItem("token"); // 로컬 스토리지에서 토큰을 가져옵니다.
  if (!storedToken) {
    handleLogout();
    return;
  }

  try {
    const response = await fetchWithToken(
      "http://localhost:8080/api/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: storedToken }), // 서버에 현재 토큰을 보냅니다.
      }
    );

    if (response.ok) {
      const data = await response.json(); // 응답 데이터를 JSON 형태로 파싱합니다.
      const newToken = data.token; // 새로운 토큰을 추출합니다.
      localStorage.setItem("token", newToken); // 로컬 스토리지에 새 토큰을 저장합니다.
      console.log(newToken)
      setToken(newToken); // 컴포넌트 상태를 업데이트합니다.
      setAuth((prevAuth) => ({ ...prevAuth, isLoggedIn: true })); // 사용자 인증 상태를 업데이트합니다.
      updateProfile(); // 필요한 추가 작업을 수행합니다.
    } else {
      handleLogout(); // 응답이 실패했다면 로그아웃 처리를 합니다.
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    handleLogout();
  }
};


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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 토큰 정보를 서버로 전송하여 로그아웃 처리
      await fetchWithToken("http://localhost:8080/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth({ isLoggedIn: false, user: null });
      localStorage.removeItem("token"); // 토큰 삭제
      navigate("/home");
    } catch (error) {
      console.error("Error logging out:", error);
      // 로그아웃 중 에러가 발생할 경우 적절한 에러 처리를 수행합니다.
    }
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
        }

        @media (max-width: 770px) {
          .responsive-span {
            display: none;
          }
        }
      `}
      </style>
      <Navbar bg="light" variant="light">
        <Container style={{ width: "100%", maxWidth: "1200px" }}>
          <Navbar.Brand>
            <Link to="/home">
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708150496729-logo.png"
                style={{ width: "100px" }}
              />
            </Link>
          </Navbar.Brand>

          <Nav className="ml-auto">
            {auth.isLoggedIn ? (
              <>
                {/* 로그인 했을 때 보여줄 링크들 */}
                <Link
                  to="/searchPage"
                  style={{
                    marginRight: "10px",
                    marginTop: "10px",
                    textDecoration: "none",
                    color: "gray",
                  }}
                >
                  <span
                    className="d-flex align-items-center"
                    style={{ width: "60px" }}
                  >
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708835552667-free-icon-magnifier-2866321.png"
                      style={{ width: "30px" }}
                    />{" "}
                    검색
                  </span>
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
                  <span className="nickname ml-2 responsive-span">
                    {auth.profile ? auth.profile.nickName : ""}
                  </span>
                  <span
                    className="responsive-span"
                    style={{ marginRight: "5px" }}
                  >
                    <Image
                      src={tempColor(
                        auth.profile ? auth.profile.temperature : ""
                      )}
                      style={{ width: "20px" }}
                    />
                    {auth.profile ? auth.profile.temperature : ""}
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
