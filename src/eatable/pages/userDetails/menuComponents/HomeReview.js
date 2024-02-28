import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import FollowButton from "../../userreview/Item/FollowButton ";
import CommentLength from "../../userreview/Item/CommentLength";
import CommentsModal from "../../userreview/Item/CommentsModal";
import { jwtDecode } from "jwt-decode";

const HomeReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);
  const [modalShow, setModalShow] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 데이터 상태
  const navigate = useNavigate;
  const draggingInfo = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    animationFrameId: null,
  });


  const handleShowComments = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
    // 모달을 표시하기 전에 댓글 데이터를 로딩합니다.
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/list/${reviewId}`
      );
      if (!response.ok) {
        throw new Error("댓글을 불러오는 데 실패했습니다.");
      }
      const data = await response.json();
      setComments(data); // 댓글 데이터 상태를 업데이트합니다.
      setCurrentReviewId(reviewId); // 현재 리뷰 ID 상태를 업데이트합니다.
      setModalShow(true); // 모달을 표시합니다.
    } catch (error) {
      console.error(error);
      // 여기에 에러 처리 로직을 추가할 수 있습니다. 예: 사용자에게 오류 메시지 표시
    }
  };

  const updateCommentsAfterEdit = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const removeComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };
  useEffect(() => {
    console.log(comments, "댓글 데이터 업데이트 후");
  }, [comments]);

  // 댓글 제출 핸들러
  const handleSubmitComment = async ({ reviewId, text }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is not found.");
      }

      // 토큰 디코딩하여 사용자 ID 얻기
      const decoded = jwtDecode(token);
      const userId = decoded.userId; // 토큰에 저장된 사용자 ID 필드명에 맞게 조정해야 할 수 있음

      const response = await fetch("http://localhost:8080/api/comments/write", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text, // CommentsModal에서 받은 댓글 내용
          userId, // 사용자 ID
          storeReviewId: reviewId, // 댓글이 달리는 리뷰의 ID
        }),
      });
      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      // 나머지 로직...
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };




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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <img
                        src={review.user.profileImageUrl}
                        alt="Profile"
                        style={{
                          width: "30px",
                          borderRadius: "50%",
                          marginRight: "5px",
                        }}
                      />
                      <span style={{ fontSize: "13px" }}>
                        {review.user.nickName}
                      </span>
                    </span>
                    <span style={{ fontSize: "13px", marginTop: "5px" }}>
                      {review.createdAt}
                    </span>
                  </div>
                  <div
                    style={{
                      marginLeft: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      <img
                        src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                        style={{
                          width: "20px",
                          marginLeft: "5px",
                          marginBottom: "5px",
                        }}
                      />
                      <span style={{ marginLeft: "5px" }}>{review.avg} </span>
                      <span>
                        <img
                          src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708761693852-free-icon-comment-check-8316018.png"
                          style={{
                            width: "25px",
                            marginBottom: "5px",
                            marginLeft: "5px",
                          }}
                        />
                        <span>
                          {" "}
                          <CommentLength storeReviewId={review.id} />{" "}
                        </span>
                      </span>
                    </span>
                    <span>
                      {/* <Button
                    style={{
                      padding: "2px",
                      fontSize: "10px",
                      marginTop: "-3px",
                    }}
                  >
                    팔로우
                  </Button> */}
                      <FollowButton
                        toId={review.user.id}
                        toId1={review.id}

                        // handleFollowStatusChange 함수 구현 필요
                      />
                    </span>
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
                  <div>
                    {/* 리뷰 리스트 렌더링 로직 */}
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708776197389-free-icon-chat-9256384.png"
                      style={{ width: "30px", cursor: "pointer" }} // cursor 속성을 추가하여 클릭 가능함을 시각적으로 나타냄
                      onClick={() => handleShowComments(review.id)}
                      alt="댓글 보기"
                    />

                    <CommentsModal
                      show={modalShow}
                      handleClose={() => setModalShow(false)}
                      reviewId={currentReviewId}
                      comments={comments}
                      onSubmit={(commentData) =>
                        handleSubmitComment({
                          ...commentData,
                          reviewId: currentReviewId,
                        })
                      }
                      onUpdateComment={updateCommentsAfterEdit} // 수정 로직을 처리하는 함수 전달
                      onDeleteComment={removeComment} // 삭제 로직을 처리하는 함수 전달
                    />
                  </div>
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
