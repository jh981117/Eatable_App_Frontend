import React, { useState, useEffect, useRef } from "react";
import { Card, Col, Container, ListGroup, Row, Tab, Tabs, Image, Button, } from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import ReservePage from "./ReservePage";
import ReservedPage from "./ReservedPage";
const UserInfoPage = () => {

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef();
  const { setAuth } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 확인

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);

     
      } catch (error) {
        console.error("Error:", error);
        setError(error);
      }
    };

    fetchProfile();
  }, []);
  if (error) {
    return <div>Error fetching profile: {error.message}</div>;
  }
  if (!profile) {
    return <div>Loading...</div>; // 또는 로딩 표시, 에러 메시지 등
  }

  //프로필 업데이트

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result); // 미리보기 이미지 설정
      };

      reader.readAsDataURL(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const uploadResponse = await fetch(
        "http://localhost:8080/api/attachments/update-image",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image.");
      }
      const profileData = await uploadResponse.json();

      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 확인

      if (!token) {
        console.error("No token found");
        return;
      }
      // 서버로부터 반환된 이미지 URL을 이용하여 프로필 업데이트
     setAuth({ isLoggedIn: true, user: profileData, profile: profileData });
   
      // 업데이트된 프로필 정보를 가져와서 상태 업데이트
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

    return (
        <Row>
        <Col className="d-flex align-items-center">
          <Card style={{ width: "100%" }} className="mb-2">
            <Card.Body className="align-items-start">
                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange}/>
                <div className="d-flex align-items-center">
                    <Image src={selectedImage || profile.profileImageUrl} alt="Profile" onClick={handleImageClick} style={{ borderRadius: "50%", maxWidth: "250px", height: "250px", cursor: "pointer" }}/>
                    <div className="d-flex align-items-center ml-3">
                        닉네임 : {profile.nickName}<br/>
                        내 소개 : 지워야되는부분 {profile.bio}<br/>
                        온도 : 위치는 여긴데... 구현은???
                    </div>
                </div>
                <div>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                  <Tab eventKey="profile" title="프로필">
                    <ListGroup variant="flush">
                      <ListGroup.Item>아이디 : {profile.username}</ListGroup.Item>
                      <ListGroup.Item>닉네임 : {profile.nickName}</ListGroup.Item>
                      <ListGroup.Item>이름 : {profile.name}</ListGroup.Item>
                      <ListGroup.Item>연락처 : {profile.phone}</ListGroup.Item>
                      <ListGroup.Item>이메일 : {profile.email}</ListGroup.Item>
                      <Button>회원탈퇴</Button>
                    </ListGroup>
                  </Tab>
                  <Tab eventKey="reserve" title="예약 현황">
                    <ListGroup variant="flush">
                      <ListGroup.Item>예약 현황</ListGroup.Item>
                      <ListGroup.Item>{ReservePage}</ListGroup.Item>
                      
                    </ListGroup>
                  </Tab>
                  <Tab eventKey="reserved" title="예약 했던곳">
                    <ListGroup variant="flush">
                      <ListGroup.Item>예약 했던곳</ListGroup.Item>
                      <ListGroup.Item>{ReservedPage}</ListGroup.Item>
                    </ListGroup>
                  </Tab>
                </Tabs>
                <div>내 취향 선택하기</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
};

export default UserInfoPage;