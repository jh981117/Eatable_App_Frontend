import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Tab,
  Tabs,
  Image,
} from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";

const UserMyPage = () => {
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
    <Container className="d-flex justify-content-center align-items-center">
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
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
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