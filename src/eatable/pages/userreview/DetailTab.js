import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ReviewList from "./ReviewList";
import StoreReviewList from "./StoreReviewList";
import ReviewImg from "./ReviewImg";
import DetailHome from "./DetailHome";
import PartnerReviewImgLength from "./Item/PartnerReviewImgLength";
import PartnerReviewLength from "./Item/PartnerReviewLength";
import MenuSection from "../userDetails/menuComponents/MenuSection";
import HomeCategoryMenu from "../userDetails/menuComponents/HomeCategoryMenu";
import HomeReview from "../userDetails/menuComponents/HomeReview";

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
            <HomeCategoryMenu id={id} />
            <HomeReview id={id} />
            <br />
            <br />
          </Tab>
          <Tab eventKey="storemenu" title="메뉴">
            <MenuSection />
            <br />
            <br />
          </Tab>
          <Tab eventKey="storeimg" title={<PartnerReviewImgLength id={id} />}>
            <ReviewImg id={id} />
            <br />
            <br />
          </Tab>
          <Tab
            eventKey="storereview"
            title={
                <PartnerReviewLength partnerId={id} />
              }
          >
          
              <StoreReviewList id={id} />
              <br />
              <br />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default DetailTab;
