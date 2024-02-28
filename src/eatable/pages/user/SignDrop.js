import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../rolecomponents/AuthContext';
import { Button, CloseButton } from 'react-bootstrap';

const SignDrop = ( ) => {

    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [inputs, setInputs] = useState({ inputPassword: "",});
    const [modalOpen, setModalOpen] = useState(false);


    const openModal = () => { setModalOpen(true); }
    const closeModal = () => { setModalOpen(false); }
   

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
                const confirm = window.confirm("정말 탈퇴하시겠습니까?");
                if (confirm) {
                    if (response.status === 200) {
                        setAuth("");
                        localStorage.removeItem("token");
                        navigate("/out");
                    } else if (response.status !== 200) {
                        navigate(-1);
                    }
                }
            } else {
                // 회원 탈퇴 실패 시 처리
                toast.error("회원 탈퇴에 실패했습니다. 비밀번호를 확인해 주세요.");
            }
        } catch (error) {
            toast.error("서버 오류로 회원 탈퇴에 실패했습니다.");
        }
    };
 
    return (
      <div>
        <input
          type="password"
          placeholder="패스워드를 입력하세요"
          value={inputs.inputPassword}
          onChange={(e) => setInputs({ ...inputs, inputPassword: e.target.value })}
        />
        { <p style={{ color: 'red' }}></p>}
        {/* <Button variant="danger" onClose={closeModal}>취소</Button> */}
        <Button variant="primary" style={{marginLeft: "27%", width: "30vh"}} onClick={handleSubmit}>회원 탈퇴</Button>
      </div>
    );
  };

export default SignDrop;