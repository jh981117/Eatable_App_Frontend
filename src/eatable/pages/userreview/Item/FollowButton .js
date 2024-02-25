import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { getUserIdFromToken } from "./getUserIdFromToken";

function FollowButton({ toId, toId1 }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const loggedInUserId = getUserIdFromToken();
      if (!loggedInUserId) {
        console.log("로그인이 필요합니다.");
        return;
      }

      const url = `http://localhost:8080/api/follow/status/${loggedInUserId}/${toId}`;

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const { isFollowing } = await response.json(); // 서버 응답 구조에 따라 조정 필요
          setIsFollowing(isFollowing);
        } else {
          throw new Error("팔로우 상태 조회 실패");
        }
      } catch (error) {
        console.error("Follow status request failed", error);
      }
    };

    checkFollowStatus();
  }, [toId, toId1]);

  const handleFollow = async () => {
    const loggedInUserId = getUserIdFromToken();
    if (!loggedInUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const method = isFollowing ? "DELETE" : "POST";
    const url = `http://localhost:8080/api/follow/${loggedInUserId}/${toId}`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        throw new Error("팔로우 처리 실패");
      }
    } catch (error) {
      console.error("Follow request failed", error);
    }
  };

  return (
    <Button
      style={{ padding: "2px", fontSize: "12px", marginTop: "-3px" }}
      onClick={handleFollow}
      variant={isFollowing ? "success" : "primary"}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </Button>
  );
}

export default FollowButton;
