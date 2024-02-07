import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Tab, } from "react-bootstrap";

import { Nav, Button } from 'react-bootstrap';
import UserInfoPage from './UserInfoPage';
import ReviewPage from "./ReviewPage";
import FollowPage from "./FollowPage";
import SignoutPage from "./SignoutPage";

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
        

      <Row>
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <Image
            src={selectedImage || profile.profileImageUrl}
            alt="Profile"
            onClick={handleImageClick}
            style={{
              borderRadius: "50%",
              maxWidth: "300px",
              height: "300px",
              cursor: "pointer",
            }}
          />
        </Col>
        <Col md={6}>
          <Card style={{ width: "100%" }} className="mb-2">
            <Card.Body>
              
              <Card.Title>User Profile</Card.Title>
              <Card.Title>{profile.nickName}</Card.Title>
              <Tabs defaultActiveKey="profile" id="profile-tab">
                <Tab eventKey="profile" title="프로필">
                  <ListGroup variant="flush">
                    <ListGroup.Item>아이디: {profile.username}</ListGroup.Item>
                    <ListGroup.Item>닉네임: {profile.nickName}</ListGroup.Item>
                    <ListGroup.Item>이름: {profile.name}</ListGroup.Item>
                  </ListGroup>
                </Tab>
                <Tab eventKey="details" title="상세 정보">
                  <ListGroup variant="flush">
                    <ListGroup.Item>소개: {profile.bio}</ListGroup.Item>
                    <ListGroup.Item>
                      권한: {profile.roles.roleName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      활성상태: {profile.activated ? "활성" : "비활성"}
                    </ListGroup.Item>
                    <ListGroup.Item>이메일: {profile.email}</ListGroup.Item>
                  </ListGroup>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
};

export default UserMyPage;