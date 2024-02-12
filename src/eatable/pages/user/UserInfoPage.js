import React, { useState, useEffect, useRef } from "react";
import {Card, Col, Container, ListGroup, Row, Tab, Tabs, Image, Button, Form, Modal} from "react-bootstrap";
import { useAuth } from "../../rolecomponents/AuthContext";
import ReservePage from "./ReservePage";
import ReservedPage from "./ReservedPage";
import { Link, json, useNavigate } from "react-router-dom";
import { Input } from "@material-ui/core";

const UserInfoPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [edit, setEdit] = useState(false);
    const [temperature, setTemperature] = useState('');
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef();
    const { auth, setAuth, updateProfile } = useAuth();
    const [modal, setModal] = useState(false);
    const [modalPW, setModalPW] = useState(false);
    const [newPW, setNewPW] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



       
//     // 회원 탈퇴 엔드포인트
// app.post(`/api/user/userout/${profile.id}`, verifyToken, (req, res) => {
//     // 토큰이 유효한지 확인합니다.
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//       if (err) {
//         res.status(403).json({ error: '인증 실패' });
//       } else {
//         // 여기서 회원 탈퇴 로직을 수행합니다.
//         res.json({ message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
//       }
//     });
//   });

//   // JWT 토큰을 검사하기 위한 미들웨어
//   function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//       const bearer = bearerHeader.split(' ');
//       const bearerToken = bearer[1];
//       req.token = bearerToken;
//       next();
//     } else {
//       // 헤더에 토큰이 없는 경우 403 Forbidden 에러를 반환합니다.
//       res.status(403).json({ error: '인증 실패' });
//     }
//   }


    // 사용자 정보 받아오기
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
            setTemperature(data.temperature);
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


    // 비밀번호 변경
    const closeModalPW = () => setModalPW(false);
    const showModalPW = () => setModalPW(true);

    // const validatePW = () => {
    //     if (입력한비밀번호 === profile.password) {
    //         // 비밀번호 변경
    //     } else {
    //         alert()
    //     }
    // }

    // 회원탈퇴
    const closeModal = () => setModal(false);
    const showModal = () => setModal(true);

    const handleLogout = () => {
        setAuth(""); // 인증상태 초기화
        setProfile(null); // 프로필 정보 초기화
        localStorage.removeItem("token");
        // 필요한 경우 localStorage에서 다른 인증 관련 데이터도 제거
      };
      console.log(localStorage.token);

    const handleDrop = () => {
      const confirm = window.confirm("정말 탈퇴하시겠습니까?");
      if (confirm) {
          // 아이디 삭제되는부분 작성해야됨.
          alert("회원탈퇴가 완료되었습니다.");
          handleLogout();
          navigate("/");
      } else {
          return;
      }
    }

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

//   // 온도바 테스트용코드
//     // 온도 증가
//     const increaseTemperature = () => {
//         setTemperature((prevTemperature) => prevTemperature + 1);
//       };
    
//       // 온도 감소
//       const decreaseTemperature = () => {
//         setTemperature((prevTemperature) => prevTemperature - 1);
//       };

  // 온도바
  const tempColor = (temperature) => {
    if (temperature < 0 && temperature > -50) {
      return "blue";
    } else if (temperature > 0 && temperature < 30) {
      return "red";
    } else if (temperature > -50 && temperature < 30) {
        return "gray"; // 기본값은 회색
    }
   
  };
    
    const color = tempColor(parseInt(temperature));

  // 막대의 길이 및 위치 계산
  let barWidth = "0%";
  let barLeft = "50%";

  if (temperature < 0) {
    // 음수 온도인 경우
    barWidth = `${(Math.abs(temperature) / 50) * 50}%`;
    barLeft =  `${50 + (temperature / 50) * 50}%`;// 0이 위에 오도록 조정
} else if (temperature > 0) {
    // 양수 온도인 경우
    barWidth = `${(temperature / 50) * 50}%`;
    barLeft = "50%";
}
console.log("온도는?" + profile.username);

  // 사용자정보 수정
  const handleUpdate = async (field, value) => {
    try {
      const response = await fetch("http://localhost:8080/api/user/update", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          [field.name]: auth.profile[field],
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
      setTemperature(value);
    } catch (error) {
      console.error("Error:", error);
      setError(error);
    }
  };
  console.log(profile);


  //프로필사진 업데이트

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

  const updateOk = (field) => {
    fieldEdit(field);
    console.log(field.value);
    handleUpdate(field);
  };

  return (
    <Container>
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
                  <Input type="text" value={profile.nickName} readOnly />
                  <br />내 소개 :{" "}
                  {edit.bio ? (
                    <Input
                      type="text"
                      value={profile.bio}
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
                  온도 : {temperature}
                  <br />
                  <div>
                    <div
                      style={{
                        backgroundColor: "gray",
                        width: "60%",
                        height: "20px",
                      }}
                    >
                      <div
                        className="temperature-bar"
                        style={{
                          backgroundColor: "gray",
                          width: "100%",
                          height: "20px",
                          position: "relative",
                        }}
                      >
                        {" "}
                        {/* 막대의 최대 너비를 100%로 설정 */}
                        {/* 온도 바 */}
                        <div
                          style={{
                            backgroundColor: color,
                            width: barWidth,
                            height: "100%",
                            position: "absolute",
                            left: barLeft,
                          }}
                        ></div>{" "}
                        {/* barWidth와 barLeft를 사용하여 막대의 위치와 너비 설정 */}
                        {/* 온도가 0인 경우 가운데 아래에 0 표시 */}
                        <span
                          style={{
                            position: "absolute",
                            left: "100%",
                            bottom: "-20px",
                          }}
                        >
                          30
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            left: "82%",
                            bottom: "-20px",
                          }}
                        >
                          20
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            left: "65%",
                            bottom: "-20px",
                          }}
                        >
                          10
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            left: "50%",
                            bottom: "-20px",
                          }}
                        >
                          0
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            left: "25%",
                            bottom: "-20px",
                          }}
                        >
                          -25
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            left: "0%",
                            bottom: "-20px",
                          }}
                        >
                          -50
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <Button variant="primary" onClick={increaseTemperature}>온도 증가</Button>
                <Button variant="danger" onClick={decreaseTemperature}>온도 감소</Button> */}
                  {/* <Input type="text" name="temperature" value={auth.profile.temperature}/> */}
                  <Button className="btn btn-primary" onClick={showModalPW}>
                    비밀번호 변경
                  </Button>
                  <Modal show={modalPW} onHide={closeModalPW}>
                    <Modal.Header closeButton>
                      <Modal.Title>비밀번호 변경</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group controlId="formPassword">
                        <Form.Label>이전 비밀번호 : </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="이전 비밀번호를 입력하세요."
                          value={profile.password}
                          onChange={(e) => setProfile.password(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formNewPassword">
                        <Form.Label>새로운 비밀번호</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="새로운 비밀번호를 입력하세요"
                          value={newPW}
                          onChange={(e) => setNewPW(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="formConfirmPassword">
                        <Form.Label>새로운 비밀번호 확인</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="새로운 비밀번호를 다시 입력하세요"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Form.Group>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeModalPW}>
                        취소
                      </Button>
                      <Button variant="primary" onClick={changeValue}>
                        변경
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button className="btn btn-danger ms-2" onClick={showModal}>
                    회원탈퇴
                  </Button>
                  <Modal show={modal} onHide={closeModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>회원탈퇴</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <input
                        type="password"
                        placeholder="비밀번호를 입력하세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeModal}>
                        취소
                      </Button>
                      <Button variant="primary" onClick={handleDrop}>
                        확인
                      </Button>
                    </Modal.Footer>
                  </Modal>
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
                          {edit.nickName ? "취소" : "수정"}
                        </Button>
                        {edit.nickName && (
                          <Button onClick={() => updateOk("nickName")}>
                            확인
                          </Button>
                        )}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        이름 :{" "}
                        <Input type="text" value={profile.name} readOnly />
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
                          {edit.phone ? "취소" : "수정"}
                        </Button>
                        {edit.phone && (
                          <Button onClick={() => updateOk("phone")}>
                            확인
                          </Button>
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
    </Container>
  );
};

export default UserInfoPage;
