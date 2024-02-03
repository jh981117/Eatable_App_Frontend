import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Tab, } from "react-bootstrap";

import { Nav, Button } from 'react-bootstrap';
import UserInfoPage from './UserInfoPage';
import ReviewPage from "./ReviewPage";
import FollowPage from "./FollowPage";
import SignoutPage from "./SignupPage";

const UserMyPage = () => {
  
  const [activeTab, setActiveTab] = useState('userInfo');

  const renderContent = () => {
    switch (activeTab) {
      case 'userInfo':
        return <UserInfoPage />;
      case 'userReviews':
        return <ReviewPage />;
      case 'userFollow':
        return <FollowPage />;
      case 'signout':
        return <SignoutPage />;
      default:
        return null;
    }
  };
 

  return (
    
    <Container className="d-flex justify-content-center align-items-center">
      
      {/* 왼쪽에 세로로 배치된 탭 메뉴 */}
      <Col sm={2}>
        <Tab.Container activeKey={activeTab}>
          <Nav variant="tabs" className="flex-column justify-content-start">
            <Button onClick={() => setActiveTab('userInfo')} variant={activeTab === 'userInfo' ? 'primary' : 'light'}>내 정보</Button>
            <Button onClick={() => setActiveTab('userReviews')} variant={activeTab === 'userReviews' ? 'primary' : 'light'}>내가 쓴 리뷰</Button>
            <Button onClick={() => setActiveTab('userFollow')} variant={activeTab === 'userFollow' ? 'primary' : 'light'}>팔로우</Button>
            <Button onClick={() => setActiveTab('signout')} variant={activeTab === 'signout' ? 'primary' : 'light'}>회원탈퇴</Button>
          </Nav>
        </Tab.Container>
      </Col>

      {/* 중앙에 컨텐츠 */}
      <Col sm={8}>
        <Tab.Content>{renderContent()}</Tab.Content>
      </Col>
        
    </Container>
  );
};

export default UserMyPage;