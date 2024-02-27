import React, { useEffect, useReducer } from 'react';

// 초기 상태
const initialState = {
    reservations: [],
};

// 액션 타입
const actionTypes = {
    SET_RESERVATIONS: 'SET_RESERVATIONS',
};

// 리듀서
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_RESERVATIONS:
            return {
                ...state,
                reservations: action.payload,
            };
        default:
            return state;
    }
};

const PartnerReservationPage = ({ id }) => {
    // useReducer 훅을 사용하여 리듀서와 상태를 설정
    const [state, dispatch] = useReducer(reducer, initialState);

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
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.topic === '/topic/reservationConfirmation') {
                // 예약 확정 메시지를 받았을 때의 처리 로직
                fetchReservations(); // 예약 목록 다시 가져오기
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket 연결 에러:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        return () => {
            socket.close();
        };
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
            <h1>현재 예약 관리</h1>

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
                            <td>{reservation.reservationState}</td>
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
