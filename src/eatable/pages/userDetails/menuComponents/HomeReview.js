import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const HomeReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);
  const draggingInfo = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    animationFrameId: null,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/store/partner/${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("리뷰 불러오기 실패:", error));
  }, [id]);

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const startDragging = (e) => {
    draggingInfo.current.isDragging = true;
    draggingInfo.current.startX = e.pageX;
    draggingInfo.current.scrollLeft = scrollRef.current.scrollLeft;
    draggingInfo.current.lastX = e.pageX;
    if (draggingInfo.current.animationFrameId) {
      cancelAnimationFrame(draggingInfo.current.animationFrameId);
      draggingInfo.current.animationFrameId = null;
    }
  };

  const onDragging = (e) => {
    if (!draggingInfo.current.isDragging) return;
    const currentX = e.pageX;
    const dx = currentX - draggingInfo.current.lastX;
    scrollRef.current.scrollLeft -= dx;
    draggingInfo.current.velocity = dx;
    draggingInfo.current.lastX = currentX;
  };

  const stopDragging = () => {
    if (!draggingInfo.current.isDragging) return;
    draggingInfo.current.isDragging = false;

    const decelerate = () => {
      if (Math.abs(draggingInfo.current.velocity) <= 1) {
        cancelAnimationFrame(draggingInfo.current.animationFrameId);
        return;
      }
      scrollRef.current.scrollLeft -= draggingInfo.current.velocity;
      draggingInfo.current.velocity *= 0.95;
      draggingInfo.current.animationFrameId = requestAnimationFrame(decelerate);
    };
    decelerate();
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
            
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d3d3d3;
            border-radius: 15px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #b3b3b3;
          }
        `}
      </style>
      <div>
        <small>방문자 리뷰</small>
      </div>
      <div
        ref={scrollRef}
        className="custom-scrollbar"
        style={{
          display: "flex",
          overflowX: "auto",
          cursor: "grab",
          userSelect: "none",
          paddingTop: "5px",
          paddingBottom: "5px",
        }}
        onMouseDown={startDragging}
        onMouseMove={onDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {reviews.map((review, reviewIndex) =>
          review.partnerReviewAttachments.map((attachment, attachmentIndex) => (
            <div
              key={`${review.id}-${attachment.id}`}
              style={{
                flex: "0 0 auto",
                marginRight: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Card>
                <Card.Header>
                  <div>
                    <img
                      src={review.user.profileImageUrl}
                      style={{ width: "30px" }}
                    />
                    {review.user.nickName}
                  </div>
                </Card.Header>
                <Card.Body>
                  <img
                    src={attachment.imageUrl}
                    alt={`Review ${reviewIndex} Attachment ${attachmentIndex}`}
                    style={{
                      width: "350px",
                      height: "350px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                    onMouseDown={(e) => e.preventDefault()} // 이미지 드래그 방지
                  />
                  <div>{review.content}</div>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default HomeReview;
