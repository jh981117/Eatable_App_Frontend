import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ImageGallery from "./Item/ImageGallery";
import FollowButton from "./Item/FollowButton ";
import CommentsModal from "./Item/CommentsModal";
import { jwtDecode } from "jwt-decode";
import CommentLength from "./Item/CommentLength";

function StoreReviewList(toId1) {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 데이터 상태

  const handleShowComments = async (reviewId) => {
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

  console.log(reviews);

  return (
    <div>
      {reviews.map((review) => (
        <Card
          key={review.id}
          className="mb-3"
          style={{
            width: "auto",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Card.Body>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span>
                    <img
                      src={review.user.profileImageUrl}
                      style={{
                        width: "30px",
                        borderRadius: "30px",
                        marginRight: "5px",

                        objectFit: "cover",
                      }}
                    />
                  </span>
                  <span>{review.user.nickName}</span>
                </span>
                <span>{review.createdAt}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span>
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                      style={{ width: "20px" }}
                    />
                  </span>
                  <span style={{ marginRight: "10px" }}>{review.avg}</span>
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
                  <FollowButton
                    toId={review.user.id}
                    toId1={toId1}

                    // handleFollowStatusChange 함수 구현 필요
                  />
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "500px",
                  maxHeight: "600px",
                }}
              >
                <ImageGallery
                  images={review.partnerReviewAttachments.map((attachment) => ({
                    src: attachment.imageUrl,
                    alt: `Review Image ${attachment.id}`,
                  }))}
                />
              </div>

              <p>{review.content}</p>
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
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default StoreReviewList;
