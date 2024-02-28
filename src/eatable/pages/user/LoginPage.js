import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../rolecomponents/AuthContext";
import { jwtDecode } from "jwt-decode";
import NaverLogin from "./NaverLogin";
import { styled} from 'styled-components';

const StyledInput = styled(Form.Control)`
  padding: 16px;
  border-radius: 7px;
  border: 0px;
  background: rgba(255, 255, 255, 1);
  color: black;
  font-size: 18px;
  height: 64px;
  width: 460px;
  margin-right: 160px;
  border: 2px solid #555555;
  &::placeholder {
    color: gray;
    font-weight: bold;
  }

  
  &:focus {
    outline-color: rgba(0, 0, 0, 0);
    background: rgba(255, 255, 255, 0.95);
    color: #e74c3c;
  }
`;



const StyledButton =styled(Button)`
  &:hover {
    background-color: gray;
  }
`;

const StyledContainer = styled(Container)`
  margin-top: 130px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; 

  @media screen and (max-width: 600px){
    margin-left: 35px;
    
  }
`;


const Styledh2 = styled.h2`
  color: black;
    font-weight: bold;
    font-size: 50px;
`;

const LoginPage = () => {

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
    submitError: "",
  });



  
  const changeValue = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitUser = async (e) => {
    e.preventDefault();

    setUser({
      usernameError: "",
      passwordError: "",
      submitError: "",
    });

    const usernameError = validateField("username", user.username);
    const passwordError = validateField("password", user.password);

    setUser({
      ...user,
      usernameError: usernameError,
      passwordError: passwordError,
    });




    const saveTokensToLocalStorage = (token) => {
      localStorage.setItem("token", token);
      // localStorage.setItem("refreshToken", refreshToken);

    };

    if (!usernameError && !passwordError) {
      try {
        const response = await fetch("http://localhost:8080/api/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
          }),
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log("로그인 성공", data);
          alert("로그인 성공!");

          saveTokensToLocalStorage(data.token); // 액세스 토큰과 리프레시 토큰 저장


          // JWT에서 사용자 정보 추출 (예: 닉네임)

          const profileResponse = await fetch(
            "http://localhost:8080/api/user/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${data.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!profileResponse.ok) {
            throw new Error("Failed to fetch profile");
          }

          const profileData = await profileResponse.json();

          // 로그인 상태와 프로필 정보를 함께 업데이트
          setAuth({
            isLoggedIn: true,
            user: profileData,
            profile: profileData,
          });

          const attemptedUrl = sessionStorage.getItem("attemptedUrl");
          if (attemptedUrl) {
            navigate("/home");
            sessionStorage.removeItem("attemptedUrl"); // 더 이상 필요 없으므로 삭제
          } else {
            // 기본 페이지로 리디렉션
            navigate("/");
          }
        } else {
          console.error("로그인 실패:", response.status);
          if (response.status === 401) {
            window.confirm("비밀번호가 틀렸습니다.");
          } else if (response.status === 403) {
            window.confirm("탈퇴한 회원입니다."); // 탈퇴한 회원일 경우의 처리
          } else {
            window.confirm("아이디가 존재하지 않습니다."); // 404
          }
        }
      }
       catch (error) {
        console.error("로그인 요청 중 오류 발생:", error);
      }
    }
  };

  // 유효성 검사 함수
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "username":
        return value.trim() === "" ? "아이디를 입력해주세요." : "";
      case "password":
        return value.trim() === ""? "비밀번호를 입력해주세요." : "" ;
    }
  };

  const signup = () => {
    navigate("/signup");
  };
 const provision = () => {
   navigate("/provision");
 };


  const saveTokenToLocalStorage = (token) => {
    // 로컬 스토리지에 토큰 저장 로직을 여기에 구현
    localStorage.setItem("token", token);
  };

  return (

    
    <Container className="mt-3 col-6 flex justify-content-center" style={{backgroundColor: "white", marginTop: "250px", borderRadius: "10px"}}>
      <Form onSubmit={submitUser}>
        <Form.Group className="mt-3" controlId="formBasicUsername">
          <Form.Label>아이디</Form.Label>
          <Form.Control

            type="text"
            name="username"
            placeholder="아이디를 입력해주세요."
            value={user.username}
            onChange={changeValue}
          />
          {user.usernameError && (
            <div className="text-danger">{user.usernameError}</div>
          )}

        </Form.Group>

        <Form.Group className="mt-3" controlId="formBasicPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요." value={user.password} onChange={changeValue}/>
          {user.passwordError && (<div className="text-danger">{user.passwordError}</div>)}
        </Form.Group>

        {user.submitError && (<div className="text-danger">{user.submitError}</div>)}
        <Button variant="light" type="submit" style={{marginRight: "5px", marginBottom: "5px"}}>로그인</Button>
        <Button variant="light" type="button" onClick={provision} style={{marginBottom: "5px"}}>회원가입</Button>
        <NaverLogin/>
      </Form>
    </Container>
  );

};

export default LoginPage;
