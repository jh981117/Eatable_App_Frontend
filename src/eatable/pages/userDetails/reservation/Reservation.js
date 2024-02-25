import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { Client } from '@stomp/stompjs';


const Reservation = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showGreeting, setShowGreeting] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );
    const [adultCount, setAdultCount] = useState(0);
    const [waitingCount, setWaitingCount] = useState(0);
    const [userId, setUserId] = useState("");
    const [webSocketConnected, setWebSocketConnected] = useState(false);

    const handleChangeDate = (date) => {
        setSelectedDate(date);
    };

    const goReservationOk = () => {
        setShowGreeting(true);
    };

    const showReservationOk = () => {
        const reservationData = {
            partnerId: id,
            userId: userId,
            people: adultCount,
            waitingRegDate: selectedDate.toISOString(),
            waitingState: "True"
        };
    
        fetch(`http://localhost:8080/api/waiting/addWaiting/` + id, {
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

    useEffect(() => {
        console.log('웹소켓 연결 시도 중...');
    
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = function (frame) {
            console.log('웹소켓 연결 성공');
            client.subscribe('/topic/waitingCount', function (message) {
                setWaitingCount(parseInt(message.body));
            });
            // 웹소켓 연결 상태 업데이트
            setWebSocketConnected(true);
        };

            client.onStompError = function (frame) {
        console.error('웹소켓 연결 실패:', frame);
        // 웹소켓 연결 상태 업데이트
        setWebSocketConnected(false);
    };

        client.activate();

        return () => {
            client.deactivate();
            console.log('웹소켓 연결 해제');
            // 웹소켓 연결 상태 업데이트
            setWebSocketConnected(false);
        };
    }, [waitingCount]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
        }
    }, []); 

    return (
        <div>
            예약 인원 설정하기 <br />
            <Button onClick={() => setAdultCount(adultCount > 0 ? adultCount - 1 : 0)}>-</Button>
            총원: {adultCount}
            <Button onClick={() => setAdultCount(adultCount + 1)}>+</Button>
            <hr />
            <Button onClick={goReservationOk}>다음</Button> <br />
            {showGreeting && (
                <>
                예약일 설정 <br/>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChangeDate}
                    showTimeSelect
                    includeTimes={[
                        setHours(setMinutes(new Date(), 0), 17),
                        setHours(setMinutes(new Date(), 30), 17),
                        setHours(setMinutes(new Date(), 0), 18),
                        setHours(setMinutes(new Date(), 30), 18),
                        setHours(setMinutes(new Date(), 0), 19),
                        setHours(setMinutes(new Date(), 30), 19),
                    ]}
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                    <br />
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
            <div>현재 대기열 수: {waitingCount}</div>
        </div>
    );
};

export default Reservation;