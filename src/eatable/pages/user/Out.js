import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Out = () => {
    const navigate = useNavigate();
    const home = () => {
        navigate("/home");
    }
    return (
        <div>
            회원탈퇴가 완료되었습니다.
            <Button onClick={home}>홈</Button> {/* 홈 이미지!!! */}
        </div>
    );
};

export default Out;