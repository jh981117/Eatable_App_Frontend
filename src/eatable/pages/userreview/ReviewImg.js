import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ReviewImg() {
  const { id } = useParams();
  const [reviewImages, setReviewImages] = useState(null); // 초기 상태를 null로 변경
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/store/partner/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰 가져오기 실패");
        }
        return response.json();
      })
      .then((data) => {
        setReviewImages(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>; // 데이터를 가져 오는 동안 로딩 표시기 렌더링
  }

  if (error) {
    return <div>오류: {error}</div>; // 가져오기 실패시 오류 메시지 렌더링
  }
  console.log(reviewImages, "111111111");
 return (
   <div>
     <style>
       {`
      .review-images {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 1000px; /* 최대 너비를 1000px로 설정 */
        margin: auto; /* 중앙 정렬 */
      }

      .review-image {
        flex: 1 1 calc(100% / 6); /* 기본적으로 한 줄에 이미지 6개 */
        max-width: calc(100% / 6); /* 이미지의 최대 너비를 1/6로 설정 */
        margin: 5px; /* 이미지 사이의 간격 */
      }

      /* 화면 너비에 따른 반응형 조정 */
      @media (max-width: 1200px) {
        .review-image {
          flex: 1 1 calc(100% / 4); /* 화면이 1200px 이하일 때 한 줄에 4개 */
          max-width: calc(100% / 4);
        }
      }

      @media (max-width: 700px) {
        .review-image {
          flex: 1 1 calc(100% / 2); /* 화면이 700px 이하일 때 한 줄에 2개 */
          max-width: calc(100% / 2);
        }
      }

      @media (max-width: 400px) {
        .review-image {
          flex: 1 1 100%; /* 화면이 400px 이하일 때 한 줄에 1개 */
          max-width: 100%;
        }
      }
      `}
     </style>
     <div className="review-images">
       {reviewImages.map((review) =>
         review.partnerReviewAttachments.map((url, index) => (
           <img
             className="review-image"
             key={index}
             src={url.imageUrl}
             alt={`Review Attachment ${index + 1}`}
           />
         ))
       )}
     </div>
   </div>
 );

}

export default ReviewImg;
