import React from "react";
import styled from "styled-components";
import { Container, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import LineChart from "./LineChart";
import BarChartNewp from "./BarChartNewp";
import ApplyList from "./ApplyList";
import CancelList from "./CancelList";
import BarChartNews from "./BarChartNews";
import History from "./History";

const StyleLink = styled(Link)`
  text-decoration: none;
  color: black;
  text-align: right;
  &:hover {
    color: gray;
  }
`;

const ResponsiveTabs = styled(Tabs)`
  @media screen and (max-width: 600px) {
    font-size: 0.5rem; /* 600px 이하일 때 h3 요소의 글자 크기를 줄임 */
  }
`;

const StyledHeading = styled.h3`
  @media screen and (max-width: 600px) {
    font-size: 1rem; /* 600px 이하일 때 h3 요소의 글자 크기를 줄임 */
    display: flex;
    justify-content: center;
  }
`;

const AdminPage = () => {
  return (
    <Container>
      <ResponsiveTabs defaultActiveKey="apply">
        <Tab eventKey="apply" title="입점신청List">
          <StyledHeading>입점신청List</StyledHeading>
          <ApplyList />
        </Tab>

        <Tab eventKey="cancel" title="입점취소List">
          <StyledHeading>입점취소List</StyledHeading>
          <CancelList />
        </Tab>

        <Tab eventKey="newp" title="신규가입자수">
          <StyledHeading>신규가입자수</StyledHeading>
          <BarChartNewp />
        </Tab>

        <Tab eventKey="news" title="신규가게수">
          <StyledHeading>신규가게수</StyledHeading>
          <BarChartNews />
        </Tab>

        <Tab eventKey="totalp" title="총가입자수">
          <StyledHeading>총가입자수</StyledHeading>
          <LineChart />
        </Tab>

        <Tab eventKey="history" title="히스토리">
          <StyledHeading>히스토리</StyledHeading>
          <History />
        </Tab>
      </ResponsiveTabs>
      <StyleLink to="/partnerlist">
        <h6>파트너 리스트</h6>
      </StyleLink>
    </Container>
  );
};

export default AdminPage;
