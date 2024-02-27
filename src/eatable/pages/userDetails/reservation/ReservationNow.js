import React, { useState, useEffect, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WaitingCount from '../item/WaitingCount';

const initialState = {
    showGreeting: false,
    adultCount: 0,
    userId: '',
    reservationId: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SHOW_GREETING':
            return { ...state, showGreeting: action.payload };
        case 'SET_ADULT_COUNT':
            return { ...state, adultCount: action.payload };
        case 'SET_USER_ID':
            return { ...state, userId: action.payload };
        case 'SET_RESERVATION_ID':
            return { ...state, reservationId: action.payload };
        default:
            return state;
    }
};

// 실시간 예약 페이지
const ReservationNow = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            dispatch({ type: 'SET_USER_ID', payload: decoded.userId });
        }
    }, []);

    const goReservationOk = () => {
        dispatch({ type: 'SET_SHOW_GREETING', payload: true });
    };

    const showReservationOk = () => {
        const { adultCount, userId } = state;
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
                dispatch({ type: 'SET_RESERVATION_ID', payload: data.reservationId });
                alert('예약이 확정되었습니다.');
    
                const webSocket = new WebSocket('ws://localhost:8080/ws');
    
                webSocket.onopen = () => {
                    console.log('WebSocket 연결 성공');
                    webSocket.send(JSON.stringify({ action: 'updateWaitingCount', partnerId: id }));
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

    const { showGreeting, adultCount, reservationId } = state;

    return (
        <div>
            예약 인원 설정하기 <br />

            <Button onClick={() => dispatch({ type: 'SET_ADULT_COUNT', payload: Math.max(adultCount - 1, 0) })}>-</Button>
            총원: {adultCount}
            <Button onClick={() => dispatch({ type: 'SET_ADULT_COUNT', payload: adultCount + 1 })}>+</Button>
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
