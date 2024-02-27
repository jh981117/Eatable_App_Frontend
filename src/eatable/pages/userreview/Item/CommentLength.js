import React, { useEffect, useState } from "react";

const CommentLength = ({ storeReviewId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLoading(true); // 데이터 가져 오기 시작시 로딩 상태 설정
    setError(null); // 오류 상태 재설정

    fetch(`http://localhost:8080/api/comments/length/${storeReviewId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰 가져오기 실패");
        }
        return response.json();
      })
      .then((data) => {
        setLength(data);
        setLoading(false); // 데이터가 가져 와지면 로딩 상태 설정 해제
      })
      .catch((error) => {
        setError(error.message); // 오류 메시지 설정
        setLoading(false); // 로딩 상태 설정 해제
      });
  }, [storeReviewId]);

  // 로딩 상태, 에러 상태에 따른 UI 처리 추가 가능
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <>
      {length === 0 ? (
        <img
          src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1709052416522-free-icon-three-dots-more-indicator-60969.png"
          style={{ width: "20px", opacity: 0.5 }}
        />
      ) : (
        length
      )}
    </>
  );
};

export default CommentLength;
