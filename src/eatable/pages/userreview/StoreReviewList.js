import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ImageGallery from "./Item/ImageGallery";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {reviews.map((review) => (
        <Card key={review.id} style={{ maxWidth: "500px" }}>
          <Card.Body>
            <div>
              <div>
                <span>
                  <img
                    src={review.user.profileImageUrl}
                    style={{
                      width: "30px",
                      borderRadius: "30px",
                      marginRight: "5px",
                    }}
                  />
                </span>
                <span>{review.user.nickName}</span>
                <span></span>
              </div>
              <span>
                <img
                  src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                  style={{ width: "20px" }}
                />
              </span>
              <span style={{ marginRight: "10px" }}>{review.avg}</span>
              <span>{review.createdAt}</span>

              <div>
                <ImageGallery
                  images={review.partnerReviewAttachments.map((attachment) => ({
                    src: attachment.imageUrl,
                    alt: `Review Image ${attachment.id}`,
                  }))}
                />
              </div>

              <p>{review.content}</p>
              {/* 추가적인 리뷰 정보 렌더링 */}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default StoreReviewList;
