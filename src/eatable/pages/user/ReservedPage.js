import React, { useEffect, useState } from 'react';

const ReservedPage = ({userId}) => {

    const [userWaitings, setUserWaitings] = useState([]);

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
    }, [userId]); // userId에 대한 의존성이 있다면 배열 안에 추가

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>이미지</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>가게 이름</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>인원</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>예약 일시</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>주소</th>
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

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservedPage;