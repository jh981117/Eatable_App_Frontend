import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserInfoPage from './UserInfoPage';
import SignoutPage from './SignoutPage';

const UpdateInfoPage = () => {

    let { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
        // 이전 상태값응ㄹ 기반으로 업데이트
        setProfile(pro => ({...pro, loading: true}));

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
        // setProfile(data);

        // 이전 상태값을 기반으롤 업데이트
        setProfile(pro => ({ ...data, loading: false}));

      } catch (error) {
        console.error("Error:", error);
        setError(error);
      }
    };

    fetchProfile();
  }, []);


//   useEffect(() => {
//     fetch("http://localhost:8080/api/user/mypage/" + id)
//       .then((response) => response.json())
//       .then((data) => setProfile(data)); // ... 사용할 필요 없이 덮어쓰기 하면 됨.
//   }, []);

  const changeValue = (e) => {
    setProfile((pro) => ({
      ...pro,
      [e.target.name]: e.target.value,
    }));
  };

  const submitInfo = (e) => {
    e.preventDefault(); // 기본 submit 동작 차단.

    const pro = {...profile, loading: undefined};

    // PUT request
    fetch('http://localhost:8080/api/user/update', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(pro),
    })
      .then((response) => {
        console.log(`response`, response);
        if (response.status === 200) {
          // 200
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          alert('수정 성공');
          console.log(`수정완료`, data);
          navigate(`api/user/mypage/${data.id}`);
        } else {
          alert('수정 실패');
        }
      });
  };

  const updateOK = () => {
    navigate("/usermypage");
  }

  


    return (
        <div>
      <Container className="mt-3 col-9">
        <Form onSubmit={submitInfo}>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>아이디</Form.Label>
                <Form.Control type="text" name="user" value={profile ? profile.username : ''} readOnly/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicSubject">
                <Form.Label>닉네임</Form.Label>
                <Form.Control type="text" placeholder="제목을 입력하세요" onChange={changeValue} name="subject" value={profile ? profile.nickName : ''}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicContent">
                <Form.Label>이름</Form.Label>
                <Form.Control type="text" onChange={changeValue} name="content" value={profile ? profile.name : ''}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicContent">
                <Form.Label>연락처</Form.Label>
                <Form.Control type="text" onChange={changeValue} name="content" value={profile ? profile.phone : ''}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicContent">
                <Form.Label>이메일</Form.Label>
                <Form.Control type="text" onChange={changeValue} name="content" value={profile ? profile.email : ''}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={updateOK}>수정완료</Button>
        </Form>
      </Container>
    </div>
    );
};

export default UpdateInfoPage;