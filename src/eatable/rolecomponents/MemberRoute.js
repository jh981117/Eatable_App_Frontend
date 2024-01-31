import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const checkMemberRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.auth ? decoded.auth.split(",") : [];
    return roles.includes("ROLE_MEMBER");
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return false;
  }
};

const MemberRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkMemberRole()) {
      navigate("/roleErrorPage"); // 멤버 권한이 없으면 오류 페이지로 리다이렉트
    }
  }, [navigate]);

  return children;
};

export default MemberRoute;
