import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPageAccess = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let role = { isAdmin: false, isMember: false, isPartner: false };
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const roles = decoded.auth.split(",");
        role = {
          isAdmin: roles.includes("ROLE_ADMIN"),
          isMember: roles.includes("ROLE_MEMBER"),
          isPartner: roles.includes("ROLE_PARTNER"),
        };
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
    }

    // 여기서 사용자 권한에 따라 리디렉션합니다.
    if (role.isAdmin) {
      navigate("/adminpage");
    } else if (role.isMember || role.isPartner) {
      setIsAuthorized(true); // 권한이 있으면, isAuthorized를 true로 설정합니다.
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  }, [navigate]);

  // 사용자가 권한이 있는 경우에만 children을 렌더링합니다.
  if (!isAuthorized) {
    return <div>Checking permissions...</div>;
  }

  return children; // 권한이 확인되면 children을 렌더링합니다.
};

export default UserPageAccess;
