import React, { useEffect, useState } from "react";
import { Button, Container, Image, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import StoreLike from "../userreview/StoreLilke";
import AutoComplete from "./AutoComplete";
import './components/SearchPage.css';


const SearchPage = () => {

  const [partners, setPartners] = useState([]);
  const [imageIndex, setImageIndex] = useState(0); // 이미지 인덱스 상태
  const [keyword, setKeyword] = useState("");

  const images = [
    "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877698462-111.png",
    "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877700672-222.png",
  ]; // 이미지 URL 배열

  const changeImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length); // 다음 이미지로 인덱스 변경
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div >
        <h3 className="text-center mb-3">Eatable 검색 결과</h3>
        <hr />

        <AutoComplete className="text-center mb-3" onAutoCompleteData={setPartners} keyword={keyword} />
        <div className="image-grid">
          <div className="image-container" onClick={() => setKeyword("족발.보쌈")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392798299-free-icon-jokbal-8740559.png"
              className="Icon"
            />
            <span className="keyword">족발.보쌈</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("돈까스")} >
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392859189-free-icon-food-12711337.png"
              className="Icon"
            />
            <span className="keyword">돈까스</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("고기.구이")} >
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392885461-free-icon-grilled-meat-1791773.png"
              className="Icon"
            />
            <span className="keyword">고기.구이</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("피자")} >
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708392913319-free-icon-pizza-2497913.png"
              className="Icon"
            />
            <span className="keyword">피자</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("찜.탕.찌개")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708395221599-free-icon-soup-8065267.png"
              className="Icon"
            />
            <span className="keyword">찜.탕.찌개</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("양식")} >
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393241132-free-icon-spaguetti-3480618.png"
              className="Icon"
            />
            <span className="keyword">양식</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("중식")} >
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393266825-free-icon-jajangmyeon-2090214.png"
              className="Icon"
            />
            <span className="keyword">중식</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("아시안")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393286213-free-icon-wonton-noodles-7593714.png"
              className="Icon"
            />
            <span className="keyword">아시안</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("치킨")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393306212-free-icon-chicken-6679109.png"
              className="Icon"
            />
            <span className="keyword">치킨</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("한식")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393325091-free-icon-rice-bowl-5990470.png"
              className="Icon"
            />
            <span className="keyword">한식</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("버거")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393341765-free-icon-beef-1720541.png"
              className="Icon"
            />
            <span className="keyword">버거</span>
          </div>
          <div className="image-container" onClick={() => setKeyword("분식")}>
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708393359686-free-icon-rice-cake-9745081.png"
              className="Icon"
            />
            <span className="keyword">분식</span>
          </div>
        </div>
        <hr />
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="text-center mb-3"
            style={{ width: "100%" }}
          >
            {/* 이미지 섹션 */}
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
                  width: "500px", // 이미지 크기 조정
                  height: "500px",
                  borderRadius: "5%",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
              <h3>{partner.storeName}</h3>
            </Link>
            <div className="d-flex justify-content-between align-items-center">
              {/* 조회수 */}
              <span>
                <Image src="https://www.siksinhot.com/static2/images/common/bg_ico_s_click.png"></Image>
                {partner.viewCnt}
              </span>
            </div>
            <StoreLike partnerId={partner.id} />

            {/* 평점 */}
            <Image
              src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
              alt="Dynamic Image"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "5%",
                objectFit: "cover",
              }}
            />

          </div>
        ))}
      </div>
    </Container>
  );
};

export default SearchPage;