import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../rolecomponents/AuthContext";
import { jwtDecode } from "jwt-decode";


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

          saveTokenToLocalStorage(data.token); // JWT 저장
          // JWT에서 사용자 정보 추출 (예: 닉네임)

      const profileResponse = await fetch('http://localhost:8080/api/user/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${data.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
          }

          const profileData = await profileResponse.json();

          // 로그인 상태와 프로필 정보를 함께 업데이트
          setAuth({ isLoggedIn: true, user: profileData, profile: profileData });



          navigate(-1) ? navigate(-1) : navigate("/home"); // 이전 페이지로 돌아가기
          

          
       
        } else {
          console.error("로그인 실패:", response.status);
          alert("로그인 실패!");
        }
      } catch (error) {
        console.error("로그인 요청 중 오류 발생:", error);
        alert("로그인 요청 중 오류 발생!");
      }
    }
  };

  // 유효성 검사 함수
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "username":
        return value.trim() === ""
          ? "아이디를 입력해주세요."
          : value === user.username
          ? ""
          : "존재하지 않는 아이디 입니다."; // 저장된 아이디인지도 확인해줘야함. 실제로 있는 아이디인지.
      case "password":
        return value.trim() === ""
          ? "비밀번호를 입력해주세요."
          : value === user.password
          ? ""
          : "비밀번호를 확인해주세요.";
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
    <Container className="mt-3 col-6 flex justify-content-center">
      <h2>로그인 페이지</h2>

      <Form onSubmit={submitUser}>
        <Form.Group className="mt-3" controlId="formBasicUsername">
          <Form.Label>아이디 : </Form.Label>
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
          <Form.Label>비밀번호 : </Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            value={user.password}
            onChange={changeValue}
          />
          {user.passwordError && (
            <div className="text-danger">{user.passwordError}</div>
          )}
        </Form.Group>

        {user.submitError && (
          <div className="text-danger">{user.submitError}</div>
        )}
        <Button variant="primary" type="submit">
          로그인
        </Button>
        <Button
          className="m-2"
          variant="primary"
          type="button"
          onClick={provision}
        >
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
