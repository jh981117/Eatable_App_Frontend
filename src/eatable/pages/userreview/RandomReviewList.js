import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { EffectCoverflow, Pagination } from "swiper";
// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Button, Container, Spinner } from "react-bootstrap";
import { throttle } from "lodash";
import FollowButton from "./Item/FollowButton ";
import { jwtDecode } from "jwt-decode";
import { Link } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import TopCategoty from "../fregment/TopCategoty";
const RandomReviewList = (toId1) => {
  const [reviewList, setReviews] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [followingList, setFollowingList] = useState([]);
  const navigate = useNavigate();

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const loadReviews = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/store/review/list?page=${page}&size=9`
        );
        if (!response.ok) throw new Error("리뷰 가져오기 실패");
        const data = await response.json();
        if (data.content) {
          const shuffledData = shuffleArray(data.content);
          setReviews((prevReviews) => [...prevReviews, ...shuffledData]);
        }
        setHasMore(data.content && data.content.length > 0);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [page]);

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

  // 팔로우 상태 변경을 처리하는 함수
  const handleFollowStatusChange = async (toUserId, isNowFollowing) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User is not logged in.");
      return;
    }

    const method = isNowFollowing ? "POST" : "DELETE";
    const url = `http://localhost:8080/api/follow/${toUserId}`; // URL 수정됨, toUserId 사용

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 포함
        },
      });

      if (response.ok) {
        // 팔로우 상태 변경 성공 시, 상태 업데이트
        if (isNowFollowing) {
          setFollowingList((prevList) => [...prevList, toUserId]);
        } else {
          setFollowingList((prevList) =>
            prevList.filter((id) => id !== toUserId)
          );
        }
      } else {
        throw new Error("Failed to update follow status");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          reviewList.map((review, index) => (
            <div
              key={index}
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

              <div style={{ padding: "10px" }}>{review.content}</div>
              <div>
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
                  <span>
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708776197389-free-icon-chat-9256384.png"
                      style={{ width: "30px" }}
                    />
                  </span>
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

export default RandomReviewList;
