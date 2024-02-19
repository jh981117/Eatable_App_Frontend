import { Input } from '@material-ui/core';
import React, { Profiler, useEffect, useState } from 'react';
import { Button, Form, ListGroup, Modal, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReservePage from './ReservePage';
import ReservedPage from './ReservedPage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useAuth } from '../../rolecomponents/AuthContext';

const SignDrop = ( ) => {

    // const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { auth, setAuth, updateProfile } = useAuth();
    const [inputs, setInputs] = useState({
        inputPassword: "",
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const response = await fetch(
                "http://localhost:8080/api/user/isPassword",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: decoded.sub,
                        password: inputs.inputPassword,
                    }),
                }
            );
            if (response.ok) {
                // 회원 탈퇴 성공 시 처리
                window.confirm("회원 탈퇴가 성공적으로 이루어졌습니다.");
                setAuth("");
                localStorage.removeItem("token");
                navigate("/home");
            } else {
                // 회원 탈퇴 실패 시 처리
                toast.error("회원 탈퇴에 실패했습니다. 비밀번호를 확인해 주세요.");
            }
        } catch (error) {
            toast.error("서버 오류로 회원 탈퇴에 실패했습니다.");
        }
    };

    console.log("비밀번호", inputs.inputPassword);
    const back = () => {
        navigate(-1);
    }
  
    return (
      <div>
        <h2>회원 탈퇴</h2>
        <input
          type="password"
          placeholder="패스워드를 입력하세요"
          value={inputs.inputPassword}
          onChange={(e) => setInputs({ ...inputs, inputPassword: e.target.value })}
        />
        { <p style={{ color: 'red' }}></p>}
        <button onClick={back}>취소</button>
        <button onClick={handleSubmit}>회원 탈퇴</button>
      </div>
    );
  };

    // const navigate = useNavigate();
    // const token = localStorage.getItem("token");
    // const decoded = jwtDecode(token); // 토큰 디코딩
    // console.log(decoded , "234234324")
    

    // useEffect = (() => {
    //     fetch(`http://localhost:8080/api/user/userdrop/${decoded.id}`,
    //     {
    //         body: JSON.stringify({
                
    //         }),
    //     })
 
    //     .then((response) => {
    //         if (response.status === 200) {
    //             return "성공";
    //         } else {
    //             return "실패";
    //         }
    //     })
    // }, []);

    // const outSubmit = (e) => {
    //     e.preventDefault();

    //     try{

    //     } catch {

    //     }
        
    //     // logout();
    //     // navigate("/home");
    // }


//     return (
//         <div>
//                 <Form onSubmit={""}>
//                     <div style={{textAlign: "center", marginBottom: "20px"}}>
//                         <h2>회원탈퇴</h2>
//                     </div>
//                     <Form.Group>
//                         <Form.Label>비밀번호</Form.Label>
//                         <Form.Control type="password" name="password" required />
//                     </Form.Group>
//                     <Button variant="primary" onClick={back}>취소</Button>
//                     <Button variant="danger" type="submit">회원탈퇴</Button>
//                 </Form>
//         </div>
//     );
// };

export default SignDrop;