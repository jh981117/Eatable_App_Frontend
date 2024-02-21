import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ReviewList from "./ReviewList";
import StoreReviewList from "./StoreReviewList";
import ReviewImg from "./ReviewImg";
import MenuSection from "../userDetails/menuComponents/MenuSection";

const DetailTab = ({ id }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Container>
        <Tabs
          defaultActiveKey="storedetail"
          id="detail-tab"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tab
            eventKey="storedetail"
            title="홈"
            style={{ display: "flex", justifyContent: "center" }}
          >
            홈
          </Tab>
          <Tab eventKey="storemenu" title="메뉴">
            <MenuSection/>
          </Tab>
          <Tab eventKey="storeimg" title="사진">
            <ReviewImg id={id} />
          </Tab>
          <Tab eventKey="storereview" title="리뷰">
            <StoreReviewList id={id} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default DetailTab;
