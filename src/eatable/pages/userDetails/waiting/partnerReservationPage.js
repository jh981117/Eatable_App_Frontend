import React, { useEffect, useReducer, useState } from 'react';
import { Client } from '@stomp/stompjs';

const initialState = {
    reservations: [],
    stompClient: null, // 새로운 stompClient 상태 추가
};

const actionTypes = {
    SET_RESERVATIONS: 'SET_RESERVATIONS',
    SET_STOMP_CLIENT: 'SET_STOMP_CLIENT', // SET_STOMP_CLIENT 액션 타입 추가
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_RESERVATIONS:
            return {
                ...state,
                reservations: action.payload,
            };
        case actionTypes.SET_STOMP_CLIENT: // SET_STOMP_CLIENT 액션 처리 추가
            return {
                ...state,
                stompClient: action.payload,
            };
        default:
            return state;
    }
};

const PartnerReservationPage = ({ id }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [waitings, setWaitings] = useState([]);

    // 대기열 정보를 가져오는 함수
    const fetchReservations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservation/reservationList/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            // 예약 시간이 빠른 순으로 정렬
            data.sort((a, b) => new Date(a.reservationRegDate) - new Date(b.reservationRegDate));
            // 액션을 디스패치하여 상태를 업데이트
            dispatch({ type: actionTypes.SET_RESERVATIONS, payload: data });
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        // useEffect 내에서 fetchReservations 호출
        fetchReservations();
    }, [id]);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = function () {
            console.log('WebSocket 연결 성공');
            client.subscribe('/topic/reservationConfirmation', function (message) {
                // 예약 확정 메시지를 받았을 때의 처리 로직
                fetchReservations(); // 예약 목록 다시 가져오기
                console.log('예약이 확정되었습니다:', message.body);
            });
            dispatch({ type: actionTypes.SET_STOMP_CLIENT, payload: client }); // stompClient 상태 업데이트
            console.log('새로운 예약 목록:', client);
        };

        client.onStompError = function (frame) {
            console.error('웹소켓 연결 실패:', frame);
        };

        client.activate();


    }, []);

    // 예약 상태를 업데이트하는 함수
    const handleReservationConfirmation = async (reservationId, newReservationState) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservation/updateReservationState/${id}/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reservationState: newReservationState })
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation state');
            }
            // 대기열 정보 다시 가져오기
            fetchReservations();
        } catch (error) {
            console.error('Error updating reservation state:', error);
        }
    };

    return (
        <div>
            <h1>현재 대기열 관리</h1>

            <table style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>예약자</th>
                        <th>매장</th>
                        <th>예약 시간</th>
                        <th>대기 상태</th>
                        <th>대기 상태 변경</th>
                    </tr>
                </thead>
                <tbody>
                    {state.reservations.map((reservation, index) => (
                        <tr key={reservation.id}>
                            <td>{index + 1}</td>
                            <td>{reservation.user.name}</td>
                            <td>{reservation.partner.storeName}</td>
                            <td>{reservation.reservationRegDate}</td>
                            <td>
                            {reservation.reservationState === 'WAITING' ? "입장대기" : 
                            reservation.reservationState === 'TRUE' ?  "입장완료" : 
                            reservation.reservationState === 'FALSE' ?  "입장안함" : ""}
                            </td>
                            <td>
                                <button onClick={() => handleReservationConfirmation(reservation.id, 'TRUE')}>
                                    입장 완료
                                </button>
                                <button onClick={() => handleReservationConfirmation(reservation.id, 'FALSE')}>
                                    입장 안함
                                </button>
                                <button onClick={() => handleReservationConfirmation(reservation.id, 'WAITING')}>
                                    입장 대기
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PartnerReservationPage;
