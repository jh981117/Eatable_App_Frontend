import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// 실시간 예약 페이지
const ReservationNow = () => {
    const navigate = useNavigate();
    let { id } = useParams();

    const [showGreeting, setShowGreeting] = useState(false);
    const [adultCount, setAdultCount] = useState(0);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
        }
    }, []);

    const goReservationOk = () => {
        setShowGreeting(true);
    };

    const showReservationOk = () => {
        const reservationData = {
            partnerId: id,
            userId: userId,
            people: adultCount,
            reservationRegDate: new Date().toISOString(), // 현재 시간으로 설정
            reservationState: "True"
        };

        fetch(`http://localhost:8080/api/reservation/addReservation/` + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        })
            .then(response => {
                if (response.ok) {
                    alert("예약 성공")
                } else {
                    throw new Error('Failed to save reservation');
                }
            })
            .catch(error => {
                console.error('Error saving reservation:', error);
            });
    };

    return (
        <div>
            예약 인원 설정하기 <br />

            {/* 성인수 조절 버튼 */}
            <Button onClick={() => setAdultCount(adultCount > 0 ? adultCount - 1 : 0)}>-</Button>
            총원: {adultCount}
            <Button onClick={() => setAdultCount(adultCount + 1)}>+</Button>
            <br />

            <hr />

            <Button onClick={goReservationOk}>다음</Button> <br />
            {showGreeting && (
                <>
                    <div className='text-center'>
                        <Button
                            style={{
                                fontSize: '1.5rem',
                                marginTop: '1rem',
                                width: '25rem',
                            }}
                            onClick={showReservationOk}
                        >
                            예약확정
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReservationNow;