import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // 올바른 import 구문 사용
import { useHistory, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";

const StoreLike = ({ partnerId }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  // 즐겨찾기 상태에 따라 이미지 URL을 결정하는 로직
  const [showLoginModal, setShowLoginModal] = useState(false); // 모달 상태
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsFavorited(false);
        setShowLoginModal(false);
      } else {
        fetchFavoriteStatus();
      }
    };

    window.addEventListener("storage", checkAuthStatus);

    checkAuthStatus(); // 초기 마운트 시에도 상태 확인

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [partnerId, auth.isLoggedIn]); // auth.isLoggedIn 의존성 추가

  const fetchFavoriteStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded)
      const userId = decoded.userId;
      try {
        const response = await fetch(
          `http://localhost:8080/api/storeLike/state`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId , partnerId }),
          }
        );
        if (response.ok) {
          const { favorited } = await response.json();
          setIsFavorited(favorited);
        } else {
          throw new Error("즐겨찾기 상태를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const toggleFavorite = async () => {
    // 토큰에서 userId 추출
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true); // 로그인 모달 표시
      return;
    }
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const response = await fetch(`http://localhost:8080/api/storeLike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT 토큰 포함
        },
        body: JSON.stringify({ userId, partnerId }),
      });

      if (response.ok) {
        // 성공적으로 즐겨찾기 상태 변경 시, UI도 업데이트
        setIsFavorited(!isFavorited);
      } else {
        // 에러 처리
        throw new Error("즐겨찾기 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const redirectToLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
    setShowLoginModal(false); // 모달 닫기
  };
  return (
    <>
      <img
        src={
          isFavorited
            ? "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877700672-222.png"
            : "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877698462-111.png"
        }
        alt="즐겨찾기"
        onClick={toggleFavorite}
        style={{ cursor: "pointer", width: "30px" }}
      />
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={redirectToLogin}>
            이동
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreLike;
