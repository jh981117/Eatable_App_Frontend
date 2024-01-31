import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkPartnerRole()) {
      navigate("/roleErrorPage"); // 파트너 권한이 없으면 오류 페이지로 리다이렉트
    }
  }, [navigate]);

  return children;
};

export default PartnerRoute;
