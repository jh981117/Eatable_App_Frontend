import React, { useEffect, useRef, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import StoreLike from "../userreview/StoreLilke";
import AutoComplete from "./AutoComplete";
import "./components/SearchPage.css";
import PartnerLikeLength from "../userreview/Item/PartnerLikeLength";
import PartnerReviewLength from "../userreview/Item/PartnerReviewLength";

const SearchPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [partners, setPartners] = useState([]);
  const [prevPartners, setPrevPartners] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [numberOfElements, setNumberOfElements] = useState(0);

  const sentinelRef = useRef(); // Intersection Observer를 위한 ref 생성
  const location = useLocation(); // useLocation 훅 사용
  const queryParams = new URLSearchParams(location.search); // URL 쿼리 매개변수 파싱
  const item = queryParams.get("keyword");

  const handleItem = () => {
    setTimeout(() => handleInputChange(item), 500);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.9,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    // 컴포넌트가 Unmount될 때 Intersection Observer 해제
    return () => observer.disconnect();
  }, []);

  // Intersection Observer 콜백 함수
  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  console.log(page);

  const images = [
    "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877698462-111.png",
    "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877700672-222.png",
  ]; // 이미지 URL 배열

  // 새로운 페이지 가져오기
  useEffect(() => {
    console.log("페이징:" + page + "검색어:" + inputValue);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/partner/search?page=${page}&keyword=${inputValue}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();

        console.log(data);
        setNumberOfElements(data.numberOfElements);

        if (page === 0) {
          setPartners(data.content);
        } else if (data.content.length === 0) {
          setLoading(false);
          return;
        } else if (numberOfElements === 6) {
          setPartners((prevPartners) => [
            ...prevPartners,
            ...data.content.filter(
              (partner) => !prevPartners.some((p) => p.id === partner.id)
            ),
          ]);
        } else if (item) {
          handleItem(item);
        }

        setTimeout(() => {
          setLoading(false); // 일정 시간 후에 로딩 상태 변경
        }, 1000); // 2초 후에 로딩 상태 변경
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, inputValue]);

  const handleInputChange = (input) => {
    setInputValue(input);
    setPage(0);
  };

  return (
    <>
      <style>
        {`
        .grid-container {
  display: grid;
  grid-template-columns: 1fr; /* 모바일에서는 한 열만 표시 */
  gap: 20px;
}

/* 태블릿과 데스크탑에서 보기 좋게 조정 */
@media (min-width: 840px) { /* 태블릿 */
  .grid-container {
    grid-template-columns: repeat(2, 1fr); /* 화면이 넓어지면 2열로 */
  }
}

@media (min-width: 1280px) { /* 데스크탑 */
  .grid-container {
    grid-template-columns: repeat(3, 1fr); /* 더 넓은 화면에서는 3열로 */
  }
}
        `}
      </style>

      <Container
        className="d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div style={{ width: "100%" }} >
          <h3 className="text-center mb-3">Eatable 검색 결과</h3>
          <hr />

          <AutoComplete
            className=" mb-3"
            onAutoCompleteData={handleInputChange}
          />

          <div className="image-grid ">
            <div
              className="image-container"
              onClick={() => handleInputChange("족발.보쌈")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392798299-free-icon-jokbal-8740559.png"
                className="Icon"
              />
              <span className="keyword">족발.보쌈</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("돈까스")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392859189-free-icon-food-12711337.png"
                className="Icon"
              />
              <span className="keyword">돈까스</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("고기.구이")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392885461-free-icon-grilled-meat-1791773.png"
                className="Icon"
              />
              <span className="keyword">고기.구이</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("피자")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392913319-free-icon-pizza-2497913.png"
                className="Icon"
              />
              <span className="keyword">피자</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("찜.탕.찌개")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708395221599-free-icon-soup-8065267.png"
                className="Icon"
              />
              <span className="keyword">찜.탕.찌개</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("양식")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393241132-free-icon-spaguetti-3480618.png"
                className="Icon"
              />
              <span className="keyword">양식</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("중식")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393266825-free-icon-jajangmyeon-2090214.png"
                className="Icon"
              />
              <span className="keyword">중식</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("아시안")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393286213-free-icon-wonton-noodles-7593714.png"
                className="Icon"
              />
              <span className="keyword">아시안</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("치킨")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393306212-free-icon-chicken-6679109.png"
                className="Icon"
              />
              <span className="keyword">치킨</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("한식")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393325091-free-icon-rice-bowl-5990470.png"
                className="Icon"
              />
              <span className="keyword">한식</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("버거")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393341765-free-icon-beef-1720541.png"
                className="Icon"
              />
              <span className="keyword">버거</span>
            </div>
            <div
              className="image-container"
              onClick={() => handleInputChange("분식")}
            >
              <Image
                src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393359686-free-icon-rice-cake-9745081.png"
                className="Icon"
              />
              <span className="keyword">분식</span>
            </div>
          </div>
          <hr />
          <div
            className="grid-container"
            style={{
              display: "grid",

              gap: "20px",
            }}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="text-center mb-3"
                style={{ width: "100%" }}
              >
                {/* 이미지 섹션 */}
                <div>
                  <Link
                    to={`/userdetail/${partner.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {/* 매장 사진 */}
                    <Image
                      src={
                        partner.fileList[0]
                          ? partner.fileList[0]?.imageUrl
                          : "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707717950973-eatabel-1.png"
                      }
                      alt="Partner"
                      style={{
                        width: "400px", // 컨테이너의 너비 고정
                        height: "400px", // 컨테이너의 높이 고정
                        marginBottom: "10px",
                        borderRadius: "5%",
                        overflow: "hidden", // 컨테이너 밖으로 나가는 이미지 숨김
                        display: "flex",
                        // alignItems: "center", // 세로 중앙 정렬
                        justifyContent: "center", // 가로 중앙 정렬
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <span
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div>
                      <Link
                        to={`/userdetail/${partner.id}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          // alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <h3 style={{ marginRight: "2px" }}>
                          {partner.storeName}
                        </h3>
                        <small style={{ color: "gray" }}>
                          {partner.favorite}
                        </small>
                        {/* 평점 */}
                        <Image
                          src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                          alt="Dynamic Image"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "5%",
                            objectFit: "cover",
                            marginLeft: "10px",
                            marginBottom: "2px",
                          }}
                        />
                        {partner.averageRating
                          ? partner.averageRating
                          : "평가중"}
                      </Link>
                    </div>
                    <span>
                      <StoreLike partnerId={partner.id} />
                    </span>
                  </span>
                </div>

                <div
                  className="d-flex justify-content "
                  style={{ marginBottom: "50px" }}
                >
                  {/* 조회수 */}
                  <span>
                    <Image
                      src="https://www.siksinhot.com/static2/images/common/bg_ico_s_click.png"
                      style={{ marginRight: "5px", marginBottom: "2px" }}
                    ></Image>
                    <span style={{ marginRight: "10px" }}>
                      {partner.viewCnt}
                    </span>
                  </span>
                  {/* 즐겨찾기 */}
                  <span>
                    <Image
                      src="https://www.siksinhot.com/static2/images/common/bg_icon_bookmark2.png"
                      style={{
                        width: "13px",
                        marginLeft: "5px",
                        marginRight: "5px",
                        marginBottom: " 2px",
                      }}
                    ></Image>
                    <PartnerLikeLength partnerId={partner.id} />
                  </span>
                  <span>
                    <Image
                      src="https://www.siksinhot.com/static2/images/common/bg_icon_reviewWrite.png"
                      style={{
                        width: "16px",
                        marginLeft: "15px",
                        marginBottom: "3px",
                        marginRight: "5px",
                      }}
                    ></Image>
                    <PartnerReviewLength partnerId={partner.id} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Intersection Observer를 위한 Sentinel */}
          <div ref={sentinelRef}></div>

          {loading && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          )}
          {!loading && (
            <>
              <hr />
              <h2 style={{ textAlign: "center", marginTop: "20px" }}>END</h2>
              <hr />
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default SearchPage;
