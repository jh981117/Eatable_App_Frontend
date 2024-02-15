import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Tab } from "react-bootstrap";

import { Nav, Button } from "react-bootstrap";
import UserInfoPage from "./UserInfoPage";
import ReviewPage from "./ReviewPage";
import FollowPage from "./FollowPage";
import SignoutPage from "./SignoutPage";
import { jwtDecode } from "jwt-decode";
import UserPartnerPage from "./UserPartnerPage";


const checkPartnerRole = () => {
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
  if (!token) return false; // 토큰이 없다면 false 반환

  try {
    const decoded = jwtDecode(token); // 토큰 디코딩
    console.log(decoded)
    const roles = decoded.auth ? decoded.auth.split(",") : [];
    console.log(decoded)
    return roles.includes("ROLE_PARTNER"); // ROLE_PARTNER 권한이 있는지 확인
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return false;
  }
};

// 함수 사용 예시
if (checkPartnerRole()) {
  console.log("파트너 권한이 있습니다.");
} else {
  console.log("파트너 권한이 없습니다.");
}

const UserMyPage = () => {
  const [activeTab, setActiveTab] = useState("userInfo");

// const na///

  

const isPartner = () => {
  // 권한 확인 로직 구현, 예시로는 항상 true를 반환
  // 실제 구현에서는 localStorage에 저장된 토큰을 확인하고
  // 해당 토큰에서 권한을 디코드하여 확인하는 로직이 될 것입니다.
  return checkPartnerRole();
};

  const renderContent = () => {
    switch (activeTab) {
      case "userInfo":
        return <UserInfoPage />;
      case "userReviews":
        return <ReviewPage />;
      case "userFollow":
        return <FollowPage />;

      case "store":
        return <UserPartnerPage />;
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
            <Button
              onClick={() => setActiveTab("userInfo")}
              variant={activeTab === "userInfo" ? "primary" : "light"}
            >
              내 정보
            </Button>
            <Button
              onClick={() => setActiveTab("userReviews")}
              variant={activeTab === "userReviews" ? "primary" : "light"}
            >
              내가 쓴 리뷰
            </Button>
            <Button
              onClick={() => setActiveTab("userFollow")}
              variant={activeTab === "userFollow" ? "primary" : "light"}
            >
              팔로우
            </Button>

 {/* 파트너 권한이 있을 경우에만 매장 관리 탭을 보여줍니다. */}
            {isPartner() && (
              <Button onClick={() => setActiveTab("store")} variant={activeTab === "storeManagement" ? "primary" : "light"}>
                매장 관리
              </Button>
            )}




           
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
