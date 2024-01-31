import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useResolvedPath } from 'react-router-dom';

const LoginPage = (props) => {

    const navigate = useNavigate();     // 페이지간 이동을 담당하는 함수 생성

    const [user, setUser] = useState({  // user상태 초기화(const로 정의 및 초기화)
        id: "",                         // useState : react의 상태관리훅(업데이트하는 함수 setuser생성)
        username: "",
        password: "",
        usernameError: "",
        passwordError: "",
        submitError:"",
    });
    console.log(user);  // user를 잘 받아오는지 콘솔창에서 확인  

    // 유효성 검사 함수
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'username':
                return value.trim() === '' ? '아이디를 입력해주세요.' : ((value === user.username) ? '' : '존재하지 않는 아이디 입니다.');     // 저장된 아이디인지도 확인해줘야함. 실제로 있는 아이디인지.
            case 'password':
                return value.trim() === '' ? '비밀번호를 입력해주세요.' : ((value === user.password) ? '' : '비밀번호를 확인해주세요.');
        }
    };

  const changeValue = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitUser = async (e) => {
    e.preventDefault();

        // < 에러상태 초기화 >
        setUser({
            usernameError: "",
            passwordError: "",
          });
        // user.setUsernameError('');
        // user.setPasswordError('');

        // < 필드에 대한 유효성 >
        const usernameError = validateField('username', user.username);
        const passwordError = validateField('password', user.password);

        // < 에러메시지 >
        setUser({
            ...user,
            usernameError: usernameError,
            passwordError: passwordError,
          });
        // user.setUsernameError(usernameError);
        // user.setPasswordError(passwordError);

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

          navigate(`/applyreq`);
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
    }

    return (
        <Container className="mt-3 col-6 flex justify-content-center">
            <h2>로그인 페이지</h2>

            <Form onSubmit={submitUser}>
                <Form.Group className="mt-3" controlId="formBasicUsername">
                    <Form.Label>아이디 : </Form.Label>
                    <Form.Control type="text" name="username" placeholder="아이디를 입력해주세요." value={user.username} onChange={changeValue}/>
                    {user.usernameError && <div className="text-danger">{user.usernameError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicPassword">
                    <Form.Label>비밀번호 : </Form.Label>
                    <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요." value={user.password} onChange={changeValue}/>
                    {user.passwordError && <div className="text-danger">{user.passwordError}</div>}
                </Form.Group>

                {user.submitError && <div className="text-danger">{user.submitError}</div>}
                <Button variant="primary" type="submit" onClick={submitUser}>로그인</Button>
                <Button className="m-2" variant="primary" type="submit" onClick={signup}>회원가입</Button>
            </Form>
        </Container>
    );
};

export default LoginPage;
