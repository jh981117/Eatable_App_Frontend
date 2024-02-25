import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";

const CommentForm = ({ onSubmit, reviewId }) => {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const userIdFromStorage = localStorage.getItem("token");

 useEffect(() => {
   // Get user ID from JWT token in local storage
   if (userIdFromStorage) {
     const decoded = jwtDecode(userIdFromStorage); // Decode JWT token
     setUserId(decoded.userId); // 예를 들어, 디코드된 객체에서 사용자 ID를 userId 프로퍼티로 가정
   }
 }, []);

const handleSubmit = (e) => {
  e.preventDefault();
  const commentData = {
    content,
    userId,
    reviewId,
  };

  // 상위 컴포넌트의 onSubmit 핸들러를 호출
  onSubmit(commentData);

  // 폼 초기화
  setContent("");
};

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="content"
          style={{ display: "block", marginBottom: "5px" }}
        >
          댓글
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
      </div>
      <button
        type="submit"
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        작성
      </button>
    </form>
  );
};

export default CommentForm;
