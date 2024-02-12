import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

// 사용자의 로그인 상태를 체크하는 함수
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // 토큰이 있으면 true, 없으면 false 반환
};

// 사용자의 권한을 체크하는 함수
const checkPartnerRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.auth ? decoded.auth.split(",") : [];
    return roles.includes("ROLE_PARTNER");
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return false;
  }
};

const PartnerRoute = ({ children }) => {
  const [permissionState, setPermissionState] = useState({
    hasPermission: true,
    checked: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      setPermissionState({ hasPermission: false, checked: false });
    } else if (!checkPartnerRole()) {
      setPermissionState({ hasPermission: false, checked: true });
    } else {
      setPermissionState({ hasPermission: true, checked: true });
    }
    sessionStorage.setItem("attemptedUrl", window.location.pathname);
  }, [navigate]);

  if (!permissionState.hasPermission) {
    if (!permissionState.checked) {
      return (
        <Container>
        <div>
          <h1>로그인 필요</h1>
          <p>이 페이지에 접근하려면 로그인이 필요합니다.</p>
          <Link to="/login" className="btn btn-primary">
            로그인 페이지
          </Link>
        </div>
        </Container>
      );
    } else {
      return (
        <Container>
          <div>
            <h1>파트너 페이지</h1>
            <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
            <Link to="/home" className="btn btn-primary">
              홈으로
            </Link>
          </div>
        </Container>
      );
    }
  }

  return children;
};

export default PartnerRoute;
