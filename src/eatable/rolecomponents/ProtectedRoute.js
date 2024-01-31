import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // 수정된 부분

// 권한 없음 모달 컴포넌트
const NoPermissionModal = ({ onClose }) => {
  return (
    <div>
      {/* 모달 내용 */}
      <p>권한이 없습니다.</p>
      <button onClick={onClose}>확인</button>
    </div>
  );
};

// 사용자의 권한을 체크하는 함수
const checkAdminRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.auth ? decoded.auth.split(",") : [];
    return roles.includes("ROLE_ADMIN");
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(!checkAdminRole());

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1); // 이전 페이지로 이동
  };

  if (showModal) {
    return <NoPermissionModal onClose={handleCloseModal} />;
  }

  return children;
};

export default ProtectedRoute;
