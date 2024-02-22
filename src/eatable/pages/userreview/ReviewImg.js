import React, { useEffect, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function ReviewImg() {
  const { id } = useParams();
  const [reviewImages, setReviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [selectedImage, setSelectedImage] = useState(""); // 선택된 이미지의 URL
  const [selectedStoreName, setSelectedStoreName] = useState(""); // 선택된 이미지에 해당하는 매장 이름
  const [selectedFavorite, setSelectedFavorite] = useState("");
  const [partnerId, setPartnerId] = useState("");
  console.log(reviewImages, "!23123123123");
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
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl, storeName, favorite, partnerId) => {
    setSelectedImage(imageUrl); // 선택된 이미지 URL 상태 업데이트
    setSelectedStoreName(storeName); // 선택된 이미지에 해당하는 매장 이름 상태 업데이트
    setSelectedFavorite(favorite);
    setPartnerId(partnerId);
    setShowModal(true); // 모달 표시
  };
  return (
    <div>
      <Container>
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
          {reviewImages.map((review, reviewIndex) =>
            review.partnerReviewAttachments.map(
              (attachment, attachmentIndex) => (
                <img
                  key={`${reviewIndex}-${attachmentIndex}`} // key 값을 unique하게 수정
                  className="review-image"
                  src={attachment.imageUrl}
                  alt={`Review Attachment ${attachmentIndex + 1}`}
                  style={{
                    objectFit: "cover",
                    cursor: "pointer",
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                  onClick={() =>
                    handleImageClick(
                      attachment.imageUrl,
                      review.partner.storeName,
                      review.partner.favorite,
                      review.partner.id
                    )
                  } // storeName을 인자로 추가
                />
              )
            )
          )}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Title style={{ marginLeft: "10px" }}>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {selectedStoreName}{" "}
                <small style={{ fontSize: "15px", color: "gray" }}>
                  {selectedFavorite}
                </small>
              </span>
              <span></span>
            </div>
          </Modal.Title>
          <Modal.Body>
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: "100%", height: "auto" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ReviewImg;
