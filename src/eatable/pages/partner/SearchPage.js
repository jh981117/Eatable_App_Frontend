import React, { useEffect, useState } from "react";
import { Button, Container, Image, Modal, Spinner } from "react-bootstrap";
import { throttle } from "lodash";
import { Link } from "react-router-dom";
import StoreLike from "../userreview/StoreLilke";
import AutoComplete from "./AutoComplete";


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

        <Image
          src="https://image.toast.com/aaaaaqx/catchtable/shopinfo/sGLE9cw-FitTFZEhOEdUT_g/gle9cw-fittfzehoedut_g_2351215074761485.jpeg?detail750"
          onClick={() => setKeyword("치킨")} style={{ height: "100px" }}
        />
        <Image
          src="https://image.toast.com/aaaaaqx/catchtable/shopinfo/snUVjSSlp0uXVetuDgQ-eWg/nuvjsslp0uxvetudgq-ewg_2352511164355747.jpg?detail750"
          onClick={() => setKeyword("한식")} style={{ height: "100px" }}
        />

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