import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import ReviewList from "./ReviewList";
import StoreReviewList from "./StoreReviewList";
import ReviewImg from "./ReviewImg";
import MenuSection from "../userDetails/menuComponents/MenuSection";

const DetailTab = () => {
  return (
    <div>
      <Container>

        <Tabs defaultActiveKey="storedetail" id="detail-tab">
          <Tab eventKey="storedetail" title="홈">
            홈
          </Tab>
          <Tab eventKey="storemenu" title="메뉴">
            <MenuSection/>
          </Tab>
          <Tab eventKey="storeimg" title="사진">
            <ReviewImg/>
          </Tab>
          <Tab eventKey="storereview" title="리뷰">
           <StoreReviewList />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default DetailTab;
