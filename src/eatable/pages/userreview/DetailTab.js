import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ReviewList from "./ReviewList";
import StoreReviewList from "./StoreReviewList";
import ReviewImg from "./ReviewImg";
import DetailHome from "./DetailHome";
import PartnerReviewImgLength from "./Item/PartnerReviewImgLength";
import PartnerReviewLength from "./Item/PartnerReviewLength";

const DetailTab = ({ id }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        maxWidth: "700px",
      }}
    >
      <Container style={{ padding: "0px" }}>
        <Tabs
          defaultActiveKey="storedetail"
          id="detail-tab"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tab eventKey="storedetail" title="홈">
            <DetailHome id={id} />
          </Tab>
          <Tab eventKey="storemenu" title="메뉴">
            메뉴
          </Tab>
          <Tab eventKey="storeimg" title={<PartnerReviewImgLength id={id} />}>
            <ReviewImg id={id} />
          </Tab>
          <Tab
            eventKey="storereview"
            title={
              <>
                <span>리뷰</span>
                <PartnerReviewLength partnerId={id} />
              </>
            }
          >
            <StoreReviewList id={id} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default DetailTab;
