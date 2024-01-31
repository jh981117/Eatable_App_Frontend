import React from "react";
import { useNavigate } from "react-router-dom";

const RoleErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home"); // 홈 페이지로 이동
  };

  return (
    <div>
      <h1>403 Forbidden</h1>
      <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      <button onClick={handleGoHome}>홈</button>
    </div>
  );
};

export default RoleErrorPage;
