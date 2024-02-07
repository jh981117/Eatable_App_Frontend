import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button, Image } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import PartnerDetail from "../partner/PartnerDetail";

const MyHeader = () => {
  const { auth, setAuth, updateProfile } = useAuth();

  useEffect(() => {
    updateProfile();
    // 의존성 배열에 auth 상태를 포함시킴으로써 auth 상태가 변경될 때마다 updateProfile 함수가 호출됩니다.
  }, []);

  console.log(auth);
  const handleLogout = () => {
    setAuth(""); // 프로필 정보도 초기화
    localStorage.removeItem("token");
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
  console.log(auth)
  return (
    <Navbar bg="light" variant="light" style={navbarStyle}>
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Eatabel
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to={"/partnerlist"} >
            <Button variant="outline-secondary"  style={logoutButtonStyle}>
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
          {auth ? (
            <>
              <Link to="/usermypage" className="d-flex align-items-center">
                {/* 세로 가운데 정렬 */}
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
                <span className="nickname ml-2" style={{ marginRight: "10px" }}>
                  {auth.profile ? auth.profile.nickName : "로그인 필요"}
                </span>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline-secondary"
                style={logoutButtonStyle} // 로그아웃 버튼에 스타일 적용
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
  );
};

export default MyHeader;
