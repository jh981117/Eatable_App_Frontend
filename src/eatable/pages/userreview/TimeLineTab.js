import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";

import TimeLineReviewList from "./TimeLineReviewList";
import "./customTabs.css"; // 커스텀 CSS 파일 import
import TimeLineHeader from "./Item/TimeLineHeader";
import RandomReviewList from "./RandomReviewList";
import FollorReviewList from "./FollorReviewList";
import TopCategoty from "../fregment/TopCategoty";
const TimeLineTab = () => {
  const [selectedTab, setSelectedTab] = useState("storemenu");
  const [selectedTabToId, setSelectedTabToId] = useState(null); // 선택된 탭에 대한 toId
  // 탭이 변경될 때마다 호출되는 함수
  const handleTabChange = (tab, toId) => {
    setSelectedTab(tab);
    setSelectedTabToId(toId);
  };
  return (
    <div>
      
      <Container style={{ padding: "0px" }}>
        <TimeLineHeader />
        <hr />
        <TopCategoty />
        <hr />
        <Tabs
          defaultActiveKey="storemenu"
          onSelect={handleTabChange}
          id="detail-tab"
          className="custom-tab-nav" // 커스텀 클래스 적용
          
        >
          <Tab eventKey="storemenu" title="추천">
            <RandomReviewList toId1={selectedTabToId} />
          </Tab>
          <Tab eventKey="storedetail" title="최근리뷰">
            <TimeLineReviewList toId1={selectedTabToId} />
          </Tab>
          <Tab eventKey="storeimg" title="팔로잉">
            <FollorReviewList toId1={selectedTabToId} />
          </Tab>
          {/* <Tab eventKey="storereview" title="리뷰"></Tab> */}
        </Tabs>
      </Container>
    </div>
  );
};

export default TimeLineTab;
