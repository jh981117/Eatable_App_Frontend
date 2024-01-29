import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom/dist";



const SignupPage = () => {

    // const dispatch = useDispatch();     //  생성한 action을 useDispatch를 통해 발생시킬 수 있다
                                        //  만들어둔 액션생성 함수를 import한다.

    const navigate = useNavigate();

    const [userinfo, setUserinfo] = useState({
        id: "",
        username: "",
        password: "",
        repassword: "",
        name: "",
        birthdate: "",
        phone: "",
        email: "",
        image: "",
        email_id: "",
        email_domain: "",
        input_domain: "",

    });
    console.log(userinfo);

    // const [Error, setError] = useState({
    //     usernameError: "",
    //     passwordError: "",
    //     repasswordError: "",
    //     phoneError: "",
    //     emailError: "",
    //     submitError: "",
    // });

    // 테스트 

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repasswordError, setRepasswordError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    // const [emailIdError, setEmailIdError] = useState('');
    // const [emailDomainError, setEmailDomainError] = useState('');
    // const [inputDomainError, setInputDomainError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const validateField = (fieldName, value) => {
        let pwreg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,13}$/;
        let birthreg = /^\d{6} - \d{7}$/;
        let phonereg =  /^\d{3}-\d{4}-\d{4}$/;
        let emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        switch (fieldName) {
            case 'username':
                return value.trim() === '' ? '아이디를 입력해주세요.' : ((value !== setUserinfo.id) ? '' : '아이디가 이미 존재합니다.');
            case 'password':
                return value.trim() === '' ? '비밀번호를 입력해주세요.' : ((pwreg.test(value)) ? '' : '영문과 숫자를 포함한 9~13자리의 비밀번호를 입력해주세요.');
            case 'repassword':
                return value.trim() === '' ? '비밀번호를 확인을 위해 다시 입력해주세요.' : ((value === userinfo.password) ? '' : '비밀번호가 일치하지 않습니다.');
            case 'birthdate':
                return value.trim() === '' ? '주민등록번호를 입력해주세요.' : ((birthreg.test(value)) ? '' : '주민등록번호 형식을 맞춰서 입력해주세요.');
            case 'phone':
                return value.trim() === '' ? '전화번호를 입력해주세요.' : ((phonereg.test(value)) ? '' : '전화번호 형식을 맞춰서 입력해주세요.');
            case 'email_id':
                return value.trim() === '' ? '메일아이디를 입력해주세요.' : '';
            case 'email_domain':
                return value.trim() === '' ? '메일주소를 입력해주세요.' : '';
            case 'email':
                const emailValue = `${userinfo['email_id']} @ ${userinfo['email_domain']}`;
                return value.trim() === '' ? '이메일을 입력해주세요.' : ((emailreg.test(emailValue)) ? '' : '이메일 형식을 맞춰서 입력해주세요.');
        }
    };

    const changeValue = (e) => {
        setUserinfo({
            ...userinfo,
            [e.target.name] : e.target.value,
        });

        // 이메일주소 직접입력선택시 input_domain 활성화
        if (e.target.name === 'email_domain' && e.target.value === 'input_domain') {
            setUserinfo((e) => ({
                ...userinfo,
                input_domain: '',
            }));
        }
    };

    const submitUserinfo = (e) => {
        e.preventDefault();

        // < 에러상태 초기화 >
        setUsernameError('');
        setPasswordError('');
        setRepasswordError('');
        setBirthdateError('');
        setPhoneError('');
        setEmailError('');
        // setEmailIdError('');
        // setEmailDomainError('');
        // setInputDomainError('');

        // < 필드에 대한 유효성 >
        const usernameError = validateField('username', userinfo.username);
        const passwordError = validateField('password', userinfo.password);
        const repasswordError = validateField('repassword', userinfo.repassword);
        const birthdateError = validateField('birthdate', userinfo.birthdate);
        const phoneError = validateField('phone', userinfo.phone);
        const emailError = validateField('email', userinfo.email);
        // const emailIdError = validateField('email_id', userinfo.email_id);
        // const emailDomainError = validateField('email_domain', userinfo.email_domain);
        // const inputDomainError = validateField('input_domain', userinfo.input_domain);

        // < 에러메시지 >
        setUsernameError(usernameError);
        setPasswordError(passwordError);
        setRepasswordError(repasswordError);
        setBirthdateError(birthdateError);
        setPhoneError(phoneError);
        setEmailError(emailError);
        // setEmailIdError(emailIdError);
        // setEmailDomainError(emailDomainError);
        // setInputDomainError(inputDomainError);

        if (!usernameError && !passwordError) {
            fetch("http://localhost:8080/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(userinfo),
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


    return (
        <div>
             <h2>회원가입</h2>

            <Form onSubmit={submitUserinfo}>
                <Form.Group className="mt-3" controlId="formBasicUsername">
                    <Form.Label>아이디 : </Form.Label>
                    <Form.Control type="text" name="username" placeholder="아이디를 입력해주세요." value={userinfo.username} onChange={changeValue}/>
                    {usernameError && <div className="text-danger">{usernameError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicPassword">
                    <Form.Label>비밀번호 : </Form.Label>
                    <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요." value={userinfo.password} onChange={changeValue}/>
                    {passwordError && <div className="text-danger">{passwordError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicRepassword">
                    <Form.Label>비밀번호 확인 : </Form.Label>
                    <Form.Control type="password" name="repassword" placeholder="비밀번호 확인을 위해 입력해주세요." value={userinfo.repassword} onChange={changeValue}/>
                    {repasswordError && <div className="text-danger">{repasswordError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicBirthdate">
                    <Form.Label>주민번호 : </Form.Label>
                    <Form.Control type="text" name="birthdate" placeholder="주민번호를 입력해주세요." value={userinfo.birthdate} onChange={changeValue}/>
                    {birthdateError && <div className="text-danger">{birthdateError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicBirthdate">
                    <Form.Label>연락처 : </Form.Label>
                    <Form.Control type="text" name="phone" placeholder="전화번호를 입력해주세요." value={userinfo.phone} onChange={changeValue}/>
                    {phoneError && <div className="text-danger">{phoneError}</div>}
                </Form.Group>

                <Form.Group className="mt-3" controlId="formBasicArea">
                    <Form.Label>이메일 : </Form.Label>
                    <Form.Control type="text" name="email" value={userinfo.email_id} onChange={changeValue}/>
                    <Form.Select onChange={changeValue} name="email" value={userinfo.email_domain}>
                        <option value="">-- 메일주소를 선택하세요. --</option>
                        <option value="naver.com">네이버</option>
                        <option value="gmail.com">구글</option>
                        <option value="hanmail.net">다음</option>
                        <option value="">직접입력</option>
                    </Form.Select>
                    {emailError && <div className="text-danger">{emailError}</div>}
                </Form.Group>

                {submitError && <div className="text-danger">{submitError}</div>}
                <Button variant="primary" type="submit" onClick={submitUserinfo}>회원가입</Button>
            </Form>
        </div>
    );
};

export default SignupPage;
