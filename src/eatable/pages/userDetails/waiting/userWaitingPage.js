import React, { useState, useEffect } from 'react';

const UserWaitingPage = ({ userId }) => {
    const [userWaitings, setUserWaitings] = useState([]);
    const [waitingOrder, setWaitingOrder] = useState(null);

    const fetchUserWaitings = async () => {
        try {
            // GET 요청을 보내어 사용자의 예약 정보를 가져옴
            const response = await fetch(`http://localhost:8080/api/waiting/userWaiting/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user waitings');
            }
            const data = await response.json();
            setUserWaitings(data);
            console.log(JSON.stringify(data) + '데이터입니다데이터');
        } catch (error) {
            console.error('Error fetching user waitings:', error);
        }
    };

    useEffect(() => {
        fetchUserWaitings();
    }, [userId]);
    


    const handleDeleteReservation = async (partnerId, waitingId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/waiting/waitingDelete/${partnerId}/${waitingId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete reservation');
            }
            // 예약 삭제 후 다시 데이터를 불러옴
            fetchUserWaitings();
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

        //waitingState 값에 따라 입장 상태 텍스트를 반환하는 함수
        const getEntranceStatusText = (waitingState) => {
            switch (waitingState) {
                case 'TRUE':
                    return '완료';
                case 'WAITING':
                    return '예약취소';
                case 'FALSE':
                    return '예약승인';
                default:
                    return '';
            }
        };

        console.log(waitingOrder+"웨이팅순서")

    return (
        <div>
            <h2>나의 예약</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>이미지</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>가게 이름</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>인원</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>예약 일시</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>주소</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>예약 상태</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {userWaitings.map(waiting => (
                        <tr key={waiting.id}>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}><img src={waiting.partner.fileList[0].imageUrl} alt="가게 이미지" style={{ width: '100px', height: '100px' }} /></td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{waiting.partner.storeName}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{waiting.people}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{new Date(waiting.waitingRegDate).toLocaleString()}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{waiting.partner.address.area}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{getEntranceStatusText(waiting.waitingState)}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                <button onClick={() => handleDeleteReservation(waiting.partner.id, waiting.id)}>예약 삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserWaitingPage;
