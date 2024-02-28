import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "./Item/getUserIdFromToken";
import { throttle } from "lodash";
import { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import FollowButton from "./Item/FollowButton ";
import { Container, Spinner } from "react-bootstrap";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { useNavigate } from "react-router-dom";
import CommentsModal from "./Item/CommentsModal";
import { jwtDecode } from "jwt-decode";
import CommentLength from "./Item/CommentLength";
const FollorReviewList = (toId1) => {
  const [reviewList, setReviews] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 관리
  const navigate = useNavigate();
  const [comments, setComments] = useState([]); // 댓글 데이터 상태
  const [modalShow, setModalShow] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);

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
    const loggedInUserId = getUserIdFromToken();
    if (!loggedInUserId) {
      console.log("로그인이 필요합니다.");
      return;
    }

    const fetchReviews = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      try {
        // 실제 요청 URL과 엔드포인트는 서버 구현에 따라 달라집니다.
        const response = await fetch(
          `http://localhost:8080/api/store/reviews/following/${loggedInUserId}?page=${page}&size=9`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // 필요한 경우 인증 헤더 추가
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json(); // 서버로부터 받은 리뷰 데이터를 JSON 형태로 변환
        if (data.content) {
          setReviews((prevReviews) => [...prevReviews, ...data.content]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [page, toId1]); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행

  console.log(reviewList, "1232132131");
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.offsetHeight &&
        hasMore &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 80);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  console.log(reviewList);

  const handleClick = (partnerId) => {
    navigate(`/userdetail/${partnerId}`);
  };
  return (
    <div>
      <style>
        {`
    .grid-container {
      display: grid;
      grid-template-columns: 1fr; /* 모바일에서는 한 열만 표시 */
      justify-items: center; /* 그리드 아이템들을 가운데 정렬 */
    }

    /* 태블릿과 데스크탑에서 보기 좋게 조정 */
    @media (min-width: 840px) { /* 태블릿 */
      .grid-container {
        grid-template-columns: repeat(2, 1fr); /* 화면이 넓어지면 2열로 */
        gap: 10px;
        width: 100%;
        max-width: 696px; /* 태블릿 및 데스크탑에서 최대 너비 적용 */
      }
    }

    @media (min-width: 1280px) { /* 데스크탑 */
      .grid-container {
        grid-template-columns: repeat(3, 1fr); /* 더 넓은 화면에서는 3열로 */
        gap: 10px;
        /* width와 max-width는 태블릿 미디어 쿼리에 이미 정의되어 있으므로, 여기서는 생략 가능 */
        width: 100%;
        max-width: 1116px; /* 태블릿 및 데스크탑에서 최대 너비 적용 */
      }
    }
  `}
      </style>

      <Container className="grid-container">
        {reviewList.length > 0 ? (
          reviewList.map((review) => (
            <div
              key={review.id}
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                marginBottom: "10px",
                padding: "15px",
                backgroundColor: "white",
                // Col 내부 div의 너비를 직접 조절하는 대신 max-width를 사용하여 유연성을 높입니다.
                width: "350px", // 너비를 100%로 설정하여 Col 내부에서 자동으로 조절되도록 합니다.
                height: "100%",
              }}
            >
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
                  <FollowButton
                    toId={review.user.id}
                    toId1={toId1}

                    // handleFollowStatusChange 함수 구현 필요
                  />
                </span>
              </div>

              {/* 이미지 슬라이더 */}
              <div
                style={{
                  position: "relative",
                }}
              >
                <Swiper
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView="auto"
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={true}
                  modules={[EffectCoverflow, Pagination]}
                  onSlideChange={(swiper) =>
                    setCurrentSlideIndex(swiper.realIndex)
                  }
                >
                  {review.partnerReviewAttachments &&
                    review.partnerReviewAttachments.map((attachment, idx) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={attachment.imageUrl}
                          alt={`Review Attachment ${idx}`}
                          style={{
                            objectFit: "cover",
                            width: "320px",
                            height: "320px",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "10px",
                    backgroundColor: "rgba(240, 240, 240, 0.5)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "30px",
                    zIndex: 1,
                  }}
                >
                  {currentSlideIndex + 1} /{" "}
                  {review.partnerReviewAttachments?.length}
                </div>
              </div>
              {/* 리뷰 내용 */}
              <div style={{ padding: "10px" }}>{review.content}</div>
              <div>
                <span>{review.partner.partnerReviewAttachments}</span>
                <hr />
                <div
                  onClick={() => handleClick(review.partner.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{review.partner.storeName}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "5px",
                      color: "gray",
                    }}
                  >
                    {review.partner.favorite}
                  </span>
                </div>
                <hr />
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
            </div>
          ))
        ) : (
          <div>리뷰가 없습니다.</div>
        )}
      </Container>
      <hr />
      {isLoading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      )}
      {!isLoading && !hasMore && (
        <p style={{ textAlign: "center" }}>모든 리뷰를 불러왔습니다.</p>
      )}
      <hr />
    </div>
  );
};

export default FollorReviewList;
