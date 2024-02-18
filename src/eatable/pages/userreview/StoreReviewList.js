import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function StoreReviewList() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); // 데이터 가져 오기 시작시 로딩 상태 설정
    setError(null); // 오류 상태 재설정

    fetch(`http://localhost:8080/api/store/partner/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰 가져오기 실패");
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false); // 데이터가 가져 와지면 로딩 상태 설정 해제
      })
      .catch((error) => {
        setError(error.message); // 오류 메시지 설정
        setLoading(false); // 로딩 상태 설정 해제
      });
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>; // 데이터를 가져 오는 동안 로딩 표시기 렌더링
  }

  if (error) {
    return <div>오류: {error}</div>; // 가져오기 실패시 오류 메시지 렌더링
  }

console.log(reviews)


  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id}>
          <p>{review.content}</p>
          {/* 추가적인 리뷰 정보 렌더링 */}
        </div>
      ))}
    </div>
  );
}

export default StoreReviewList;
