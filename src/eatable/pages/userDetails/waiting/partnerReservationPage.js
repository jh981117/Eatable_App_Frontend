import React, { useEffect, useState } from 'react';

const PartnerReservationPage = ({ id }) => {
    const [reservations, setReservations] = useState([]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservation/reservationList/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            // 예약 시간이 빠른 순으로 정렬
            data.sort((a, b) => new Date(a.reservationRegDate) - new Date(b.reservationRegDate));
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        // useEffect 내에서 fetchReservations 호출
        fetchReservations();
    }, [id]);

    const updateReservationState = async (reservationId, newReservationState) => {
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
            // 대기열 상태 업데이트 후 다시 대기열을 불러옴
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
                    {reservations.map((reservation, index) => (
                        <tr key={reservation.id}>
                            <td>{index + 1}</td>
                            <td>{reservation.user.name}</td>
                            <td>{reservation.partner.storeName}</td>
                            <td>{reservation.reservationRegDate}</td>
                            <td>{reservation.reservationState}</td>
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
