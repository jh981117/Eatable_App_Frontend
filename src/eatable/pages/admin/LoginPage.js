import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useResolvedPath } from 'react-router-dom';

const LoginPage = (props) => {

    const navigate = useNavigate();     // 페이지간 이동을 담당하는 함수 생성

    const [user, setUser] = useState({  // user상태 초기화(const로 정의 및 초기화)
        id: "",                         // useState : react의 상태관리훅(업데이트하는 함수 setuser생성)
        password: "",
    });
    console.log(user);  // user를 잘 받아오는지 콘솔창에서 확인

    // useState훅을 사용 각 필드에대한 오류 메시지를 빈 문자열로 설정.
    const [idError, setIdError] = useState('');
    const [pwError, setPwError] = useState('');

    // 제출 과정에서 발생하는 오류 메시지를 저장
    const [submitError, setSubmitError] = useState('');     

    // 유효성 검사 함수
    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'id':
                return value.trim() === '' ? '아이디를 입력해주세요.' : ((value == setUser.id) ? '' : '존재하지 않는 아이디 입니다.');     // 저장된 아이디인지도 확인해줘야함. 실제로 있는 아이디인지.
            case 'password':
                return value.trim() === '' ? '비밀번호를 입력해주세요.' : ((value == setUser.password) ? '' : '비밀번호를 확인해주세요.');
        }
    };

    const changeValue = (e) => {
        setUser({
            ...user,
            [e.target.name] : e.target.value,
        });
    };

    const submitUser = (e) => {
        e.preventDefault();

        // < 에러상태 초기화 >
        setIdError('');
        setPwError('');

        // < 필드에 대한 유효성 >
        const idError = validateField('id', user.id);
        const pwError = validateField('password', user.password);

        // < 에러메시지 >
        setIdError(idError);
        setPwError(pwError);

        if (!idError && !pwError) {
            // fetch("http://localhost:8080/user/login", {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json;charset=utf-8',
            //     },
            //     body: JSON.stringify(user),
            // })
            // .then(response => {
            //     console.log(`response`, response);
            //     if (response.status === 201) {
            //         return response.json();                    
            //     } else {
            //         return null;
            //     }
            // })
            // .then(data => {
            //     if (data !== null) {
            //         console.log(`로그인 성공`, data);
            //         alert("로그인 성공!");
            //         navigate(`home`);
            //     } else {
            //         alert("로그인 실패!");
            //     }
            // });
            alert("로그인 성공!");
            navigate(`home`);
        }
    };

    return (
        <div>
            <h2>로그인 페이지</h2>

            <Form onSubmit={submitUser}>
                <Form.Group className="mt-3" controlId="formBasicId">
                    <Form.Label>아이디 : </Form.Label>
                    <Form.Control type="text" name="id" placeholder="아이디를 입력해주세요." value={user.id} onChange={changeValue}/>
                    {idError && <div className="text-danger">{idError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicPw">
                    <Form.Label>비밀번호 : </Form.Label>
                    <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요." value={user.password} onChange={changeValue}/>
                    {pwError && <div className="text-danger">{pwError}</div>}
                </Form.Group>

                {submitError && <div className="text-danger">{submitError}</div>}
                <Button variant="primary" type="submit" onClick={submitUser}>로그인</Button>
            </Form>
        </div>
    );
};

export default LoginPage;