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
  Button,
  Form,
} from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import ReservePage from "./ReservePage";
import ReservedPage from "./ReservedPage";
import { Link, json, useNavigate } from "react-router-dom";
import UpdateInfoPage from "./UpdateInfoPage";
import SignoutPage from "./SignoutPage";
import { Input } from "@material-ui/core";

const UserInfoPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const { auth, setAuth, updateProfile } = useAuth();

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

  //   const handleDrop = () => {
  //     const confirm = window.confirm("정말 탈퇴하시겠습니까?");
  //     if (confirm) {
  //         // 아이디 삭제되는부분 작성해야됨.
  //         alert("회원탈퇴가 완료되었습니다.");
  //     } else {
  //         return;
  //     }
  //   }

  const fieldEdit = (field) => {
    setEdit((state) => ({
      ...state,
      [field]: !state[field],
    }));
  };

  const changeValue = (e, field) => {
    setProfile({
      ...profile,
      [field]: e.target.value,
    });
  };

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

  const handleUpdate = async (e, field) => {
    try {
      const response = await fetch("http://localhost:8080/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          [field]: auth.profile[field],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const data = await response.json();
      setAuth((data1) => ({
        ...data1,
        profile: data,
      }));
      updateProfile();
    } catch (error) {
      console.error("Error:", error);
      setError(error);
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

  const updateOk = (field) => {
    fieldEdit(field);
    console.log(field.value);
    handleUpdate(field);
  };

  return (
    <Row>
      <Col className="d-flex align-items-center">
        <Card style={{ width: "100%" }} className="mb-2">
          <Card.Body className="align-items-start">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="d-flex align-items-center">
              <Image
                src={selectedImage || profile.profileImageUrl}
                alt="Profile"
                onClick={handleImageClick}
                style={{
                  borderRadius: "50%",
                  maxWidth: "250px",
                  height: "250px",
                  cursor: "pointer",
                }}
              />
              <div className="flex align-items-center ml-3">
                닉네임 :{" "}
                {edit.nickName ? (
                  <Input
                    type="text"
                    value={auth.profile.nickName}
                    onChange={(e) => changeValue(e, "nickName")}
                  />
                ) : (
                  <span>{profile.nickName}</span>
                )}
                <Button onClick={() => fieldEdit("nickName")}>
                  {edit.nickName ? "취소" : "수정"}
                </Button>
                {edit.nickName && (
                  <Button onClick={() => updateOk("nickName")}>확인</Button>
                )}
                <br />내 소개 :{" "}
                {edit.bio ? (
                  <Input
                    type="text"
                    value={auth.profile.bio}
                    onChange={(e) => changeValue(e, "bio")}
                  />
                ) : (
                  <span>{profile.bio}</span>
                )}
                <Button onClick={() => fieldEdit("bio")}>
                  {edit.bio ? "취소" : "수정"}
                </Button>
                {edit.bio && (
                  <Button onClick={() => updateOk("bio")}>확인</Button>
                )}
                <br />
                온도 : <Input type="text" name="1" value={"1"} />
              </div>
            </div>
            <div>
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="profile" title="프로필">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      아이디 :{" "}
                      <Input type="text" value={profile.username} readOnly />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      닉네임 :{" "}
                      {edit.nickName ? (
                        <Input
                          type="text"
                          value={profile.nickName}
                          onChange={(e) => changeValue(e, "nickName")}
                        />
                      ) : (
                        <span>{profile.nickName}</span>
                      )}
                      <Button onClick={() => fieldEdit("nickName")}>
                        {edit.nickName ? "취소" : "변경"}
                      </Button>
                      {edit.nickName && (
                        <Button onClick={() => updateOk("nickName")}>
                          확인
                        </Button>
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      이름 : <Input type="text" value={profile.name} readOnly />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      연락처 :{" "}
                      {edit.phone ? (
                        <Input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => changeValue(e, "phone")}
                        />
                      ) : (
                        <span>{profile.phone}</span>
                      )}
                      <Button onClick={() => fieldEdit("phone")}>
                        {edit.phone ? "취소" : "변경"}
                      </Button>
                      {edit.phone && (
                        <Button onClick={() => updateOk("phone")}>확인</Button>
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      이메일 :{" "}
                      <Input type="text" value={profile.email} readOnly />
                    </ListGroup.Item>
                    {/* <Button onClick={updateInfo}>수정</Button> */}
                    {/* <Button onClick={dropOK}>회원탈퇴</Button> */}
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
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserInfoPage;
