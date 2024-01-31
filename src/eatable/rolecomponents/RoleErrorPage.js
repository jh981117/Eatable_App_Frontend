import React from "react";
import { useNavigate } from "react-router-dom";

const RoleErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home"); // 홈 페이지로 이동
  };

  const handleGoBack = () => {
    console.log("뒤로 가기 시도, 히스토리 길이:", window.history.length);
    if (window.history.length > 1) {
      console.log("이전 페이지로 이동");
      navigate(-1);
    } else {
      console.log("홈으로 이동");
      navigate("/home");
    }
  };

  return (
    <div>
      <h1>403 Forbidden</h1>
      <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      <button onClick={handleGoHome}>홈</button>
      <button onClick={handleGoBack}>뒤로 가기</button>
    </div>
  );
};

export default RoleErrorPage;
