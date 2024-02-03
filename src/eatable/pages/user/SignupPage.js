import React, { useEffect, useState } from "react";
import { Button, Container, Form, FormControl } from 'react-bootstrap';
import { useNavigate } from "react-router-dom/dist";
import ProvisionPage from "./ProvisionPage";



const SignupPage = () => {

    const navigate = useNavigate();

    const [userdata, setUserdata] = useState();

    console.log(userdata);

    useEffect(() => {
        fetch("http://localhost:8080/api/user/list")
        .then(response => response.json())
        .then(data => {
            setUserdata(data);

        });
    }, []);

    const [emailsum, setEmailsum] = useState("");

    const [userinfo, setUserinfo] = useState({
        id: "",
        username: "",
        password: "",
        repassword: "",
        name: "",
        nickName: "",
        birthdate: "",
        phone: "",
        email: "",
        image: "",
        email_id: "",
        email_domain: "",
    });
    console.log(userinfo);

    const [error, setError] = useState({
        usernameError: "",
        passwordError: "",
        repasswordError: "",
        nameError: "",
        nickNameError: "",
        birthdateError: "",
        phoneError: "",
        emailError: "",
        submitError: "",
    });


    const validateField = (fieldName, value) => {
        let pwreg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,13}$/;
        let birthreg = /^\d{4}\d{2}\d{2}$/;
        let phonereg =  /^\d{3}\d{4}\d{4}$/;
        // let emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        switch (fieldName) {
            case 'username':
                return value.trim() === '' ? '아이디를 입력해주세요.' : (userdata.some(user => user.username === value.trim()) ? '아이디가 이미 존재합니다.' : '');
            case 'password':
                return value.trim() === '' ? '비밀번호를 입력해주세요.' : ((pwreg.test(value)) ? '' : '영문과 숫자를 포함한 9~13자리의 비밀번호를 입력해주세요.');
            case 'repassword':
                return value.trim() === '' ? '비밀번호를 확인을 위해 다시 입력해주세요.' : ((value === userinfo.password) ? '' : '비밀번호가 일치하지 않습니다.');
            case 'name':
                return value.trim() === '' ? '이름을 입력해주세요.' : '';
            case 'nickName':
                return value.trim() === '' ? '별명을 입력해주세요.' : '';
            case 'birthdate':
                return value.trim() === '' ? '주민등록번호를 입력해주세요.' : ((birthreg.test(value)) ? '' : '주민등록번호 형식을 맞춰서 입력해주세요.');
            case 'phone':
                return value.trim() === '' ? '전화번호를 입력해주세요.' : ((phonereg.test(value)) ? '' : '전화번호 형식을 맞춰서 입력해주세요.');
            case 'email_id':
                return value.trim() === '' ? '메일아이디를 입력해주세요.' : '';
            case 'email_domain':
                return value.trim() === '' ? '메일주소를 입력해주세요.' : '';
            case 'email':
                const emailId = userinfo['email_id'].trim();
                const emailDomain = userinfo['email_domain'].trim();
                const emailValue = `${emailId}@${emailDomain}`;
                // const emailError = emailValue.trim() === '' ? '이메일을 입력해주세요.' : (emailreg.test(emailValue) ? '' : '이메일 형식을 맞춰서 입력해주세요.');
                // return emailError;
                // console.log(emailValue);
        }
    };

    const changeValue = (e) => {
      setUserinfo({
        ...userinfo,
        [e.target.name]: e.target.value,
      });

        // 이메일주소 직접입력선택시 input_domain 활성화
        if (e.target.name === 'email_domain' && e.target.value === 'input_domain') {
            setUserinfo((e) => ({
                ...userinfo,
                input_domain: '',
            }));
        }

        // emailsum email_id와 input_domain 추가
        if (e.target.name === 'email_id' || e.target.name === 'input_domain') {
            setEmailsum([...emailsum, userinfo['email_id'] + '@' + userinfo['email_domain']]);
        }

    };

    const submitUserinfo = (e) => {
        e.preventDefault();

        // < 에러상태 초기화 >
        setError({
            usernameError: "",
            passwordError: "",
            repasswordError: "",
            nameError: "",
            nickNameError: "",
            birthdateError: "",
            phoneError: "",
            emailError: "",
            submitError: "",
          });
        

        // < 필드에 대한 유효성 >
        const usernameError = validateField('username', userinfo.username);
        const passwordError = validateField('password', userinfo.password);
        const repasswordError = validateField('repassword', userinfo.repassword);
        const nameError = validateField('name', userinfo.name);
        const nickNameError = validateField('nickName', userinfo.nickName);
        const birthdateError = validateField('birthdate', userinfo.birthdate);
        const phoneError = validateField('phone', userinfo.phone);
        const emailError = validateField('email', userinfo.email);

        // < 에러메시지 >
        setError({
            ...error,
            usernameError: usernameError,
            passwordError: passwordError,
            repasswordError: repasswordError,
            nameError: nameError,
            nickNameError: nickNameError,
            birthdateError: birthdateError,
            phoneError: phoneError,
            emailError: emailError,
          });
          console.log('emailValue:', userdata.email);


        const emailId = userinfo['email_id'].trim();
        const emailDomain = userinfo['email_domain'].trim();
        const emailValue = `${emailId}@${emailDomain}`;

        if (!usernameError && !passwordError && !repasswordError && !nameError && !nickNameError && !birthdateError && !phoneError && !emailError) {
            fetch("http://localhost:8080/api/user/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    ...userinfo,
                    email: emailValue,
                }),
            })
            .then(response => {
                console.log(`response`, response);
                if (response.status === 201) {
                    return response.json();                    
                } else {
                    return null;
                }
            })
            .then(data => {
                if (data !== null) {
                    console.log(`가입 성공`, data);
                    alert("가입 성공!");
                    navigate(`/login`);
                } else {
                    alert("가입 실패!");
                }
            });
            alert("가입 성공!");
            navigate(`/login`);
        }
    };

    const back = () => {
        navigate(-1);
    }



    return (
        <Container className="mt-3 flex justify-content-center">

             <h2>회원가입</h2>

            <Form onSubmit={submitUserinfo}>
                <Form.Group className="mt-3" controlId="formBasicUsername">
                    <Form.Label>아이디 : </Form.Label>
                    <Form.Control type="text" name="username" placeholder="아이디를 입력해주세요." value={userinfo.username} onChange={changeValue}/>
                    {error.usernameError && <div className="text-danger">{error.usernameError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicPassword">
                    <Form.Label>비밀번호 : </Form.Label>
                    <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요." value={userinfo.password} onChange={changeValue}/>
                    {error.passwordError && <div className="text-danger">{error.passwordError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicRepassword">
                    <Form.Label>비밀번호 확인 : </Form.Label>
                    <Form.Control type="password" name="repassword" placeholder="비밀번호 확인을 위해 입력해주세요." value={userinfo.repassword} onChange={changeValue}/>
                    {error.repasswordError && <div className="text-danger">{error.repasswordError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicName">
                    <Form.Label>이름 : </Form.Label>
                    <Form.Control type="text" name="name" placeholder="이름을 입력해주세요." value={userinfo.name} onChange={changeValue}/>
                    {error.nameError && <div className="text-danger">{error.nameError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicNickname">
                    <Form.Label>별명 : </Form.Label>
                    <Form.Control type="text" name="nickName" placeholder="별명을 입력해주세요." value={userinfo.nickName} onChange={changeValue}/>
                    {error.nickNameError && <div className="text-danger">{error.nickNameError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicBirthdate">
                    <Form.Label>주민번호 : </Form.Label>
                    <Form.Control className="form-control col-3" type="text" name="birthdate" placeholder="주민번호를 입력해주세요." value={userinfo.birthdate} onChange={changeValue}/>
                    {error.birthdateError && <div className="text-danger">{error.birthdateError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicBirthdate">
                    <Form.Label>연락처 : </Form.Label>
                    <Form.Control className="form-control col-3" type="text" name="phone" placeholder="전화번호를 입력해주세요." value={userinfo.phone} onChange={changeValue}/>
                    {error.phoneError && <div className="text-danger">{error.phoneError}</div>}
                </Form.Group>

                <Form.Group className="mt-3 col-3" controlId="formBasicEmail">
                    <Form.Label>이메일 : </Form.Label>
                    <div className="d-flex">
                        <Form.Control className="form-control col-3" type="text" name="email_id" value={userinfo.email_id} onChange={changeValue}/>
                        <span className="mx-2"> @ </span>
                        <FormControl className="form-control ms-2 col-3" type="text" name="email_domain" value={userinfo.email_domain} onChange={changeValue}/>
                        <Form.Select className="form-control ms-4 col-3"
                            onChange={(e) => {
                                changeValue(e);
                                const value = e.target.value === "" ? "" : e.target.value;
                                changeValue({
                                target: {
                                    name: "email_domain",
                                    value: value,
                                },
                                });
                            }}
                            name="email_domain"
                            value={userinfo.email_domain}>
                            <option value="">-- 메일주소를 선택하세요. --</option>
                            <option value="naver.com">naver.com</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="hanmail.net">hanmail.net</option>
                            <option value="">직접입력</option>
                        </Form.Select>

                    </div>
                    {error.emailError && <div className="text-danger">{error.emailError}</div>}
                </Form.Group>

                {error.submitError && <div className="text-danger">{error.submitError}</div>}

                <Button variant="primary" onClick={back}>이전으로</Button>
                <Button variant="primary" type="submit" onClick={submitUserinfo}>회원가입</Button>
            </Form>
        </Container>
    );
};

export default SignupPage;
