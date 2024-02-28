import React, { useEffect, useReducer, useState } from 'react';
import { Client } from '@stomp/stompjs';

const initialState = {
    reservations: [],
    stompClient: null, // 새로운 stompClient 상태 추가
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_RESERVATIONS':
            return { ...state, reservations: action.payload };
        case 'SET_STOMP_CLIENT':
            return { ...state, stompClient: action.payload };
        default:
            return state;
    }
};

const PartnerReservationPage = ({ id }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [reservations, setReservations] = useState([]);

        // 웹소켓 연결과 대기열 정보 불러오기
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
                console.log('웹소켓 연결 성공');
                client.subscribe('/topic/reservationList', function (message) {
                    const receivedReservations = JSON.parse(message.body);
                    dispatch({ type: 'SET_RESERVATIONS', payload: receivedReservations });
                    console.log('웨이팅이 업데이트되었습니다:', receivedReservations);
                });
                client.subscribe('/topic/updateReservationList', function (message) {
                    // 예약 확정 후에도 대기열 정보를 업데이트
                    fetchReservations();
                    console.log('대기열이 확정되었습니다:', message.body);
                });
                dispatch({ type: 'SET_STOMP_CLIENT', payload: client });
                console.log('새로운 예약 목록:', client);
            };
    
            client.onStompError = function (frame) {
                console.error('웹소켓 연결 실패:', frame);
            };
    
            client.activate();

                // cleanup 함수 정의
    return () => {
        console.log('WebSocket 연결 해제');
        client.deactivate(); // 웹소켓 연결 해제
    };
    
      
        }, []);

        const fetchReservations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/reservation/reservationList/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                console.log(id+'sdgagdsanklagsdngdalskngadslk')
                const data = await response.json(); // JSON 형태의 데이터로 변환
                // 예약 시간이 빠른 순으로 정렬
                data.sort((a, b) => new Date(a.reservationRegDate) - new Date(b.reservationRegDate));
                setReservations(data);
                console.log(data+'aasdggadsgasdadgsagsdgasdgasd')
                console.log('웨이팅이 업데이트되었습니다:', data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };




    useEffect(() => {
        // useEffect 내에서 fetchReservations 호출
        fetchReservations();
    }, [id]);

    const updateReservationState = async (reservationId, newReservationState) => {
        const reservationDto = {
            reservationState: newReservationState
        };

        try {
            const response = await fetch(`http://localhost:8080/api/reservation/updateReservationState/${id}/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservationDto) // reservationDto를 JSON 문자열로 변환하여 전송
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation state');
            }
            // 대기열 상태 업데이트 후 웹소켓을 통해 실시간으로 대기열을 다시 불러옴
            fetchReservations();

            // 대기열 상태 업데이트 성공 시 로그 출력
            console.log('Reservation state updated successfully.');

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
                {reservations.map((reservation, index) => (
                        <tr key={reservation.id}>
                            <td>{index + 1}</td>
                            <td>{reservation.user.name}</td>
                            <td>{reservation.partner.storeName}</td>
                            <td>{reservation.reservationRegDate}</td>
                            <td>
                                {reservation.reservationState === 'WAITING' ? "입장대기" :
                                    reservation.reservationState === 'TRUE' ? "입장완료" :
                                    reservation.reservationState === 'FALSE' ? "입장안함" : ""}
                            </td>
                            <td>
                                <button onClick={() => updateReservationState(reservation.id, 'TRUE')}>
                                    입장 완료
                                </button>
                                <button onClick={() => updateReservationState(reservation.id, 'FALSE')}>
                                    입장 안함
                                </button>
                                <button onClick={() => updateReservationState(reservation.id, 'WAITING')}>
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
