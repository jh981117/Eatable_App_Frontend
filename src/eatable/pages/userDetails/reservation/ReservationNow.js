import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WaitingCount from '../item/WaitingCount';

// 실시간 예약 페이지
const ReservationNow = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showGreeting, setShowGreeting] = useState(false);
    const [adultCount, setAdultCount] = useState(0);
    const [userId, setUserId] = useState("");
    const [reservationId, setReservationId] = useState(null);

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
            reservationRegDate: new Date().toISOString(),
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
                    return response.json();
                } else {
                    throw new Error('Failed to save reservation');
                }
            })
            .then(data => {
                setReservationId(data.reservationId);
                alert('예약이 확정되었습니다.');
    
                // 웹소켓을 이용하여 대기열 정보를 업데이트
                const webSocket = new WebSocket('ws://localhost:8080/ws');
    
                webSocket.onopen = () => {
                    console.log('WebSocket 연결 성공');
                    // 대기열 정보 요청
                    webSocket.send(JSON.stringify({ action: 'updateWaitingCount', partnerId: id }));
                };
    
                webSocket.onmessage = (event) => {
                    // 대기열 정보를 받아서 처리
                    const waitingCount = JSON.parse(event.data);
                    console.log('대기열 정보:', waitingCount);
                    // 여기서 대기열 정보를 상태에 반영하거나 다른 작업을 수행할 수 있습니다.
                };
    
                webSocket.onerror = (error) => {
                    console.error('WebSocket 연결 에러:', error);
                };
    
                webSocket.onclose = () => {
                    console.log('WebSocket 연결 종료');
                };
            })
            .catch(error => {
                console.error('Error saving reservation:', error);
            });
    };

    return (
        <div>
            예약 인원 설정하기 <br />

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
                        {reservationId && <WaitingCount partnerId={id} reservationId={reservationId} />}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReservationNow;
