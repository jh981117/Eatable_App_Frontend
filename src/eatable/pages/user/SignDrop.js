import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
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
                window.confirm("정말 탈퇴하시겠습니까?");
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

export default SignDrop;