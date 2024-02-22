import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PartnerWaitingPage = ({id}) => {
    const [waitings, setWaitings] = useState([]);

    console.log(id+'id값입니다')
    console.log(waitings+'웨이팅값입니다')

    useEffect(() => {
        const fetchWaitings = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/waiting/waitingList/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch waitings');
                }
                let data = await response.json();
                // 예약 시간이 빠른 순으로 정렬
                data.sort((a, b) => new Date(a.waitingRegDate) - new Date(b.waitingRegDate));
                setWaitings(data);
            } catch (error) {
                console.error('Error fetching waitings:', error);
            }
        };

        fetchWaitings();
    }, [id]);
    

    return (
        <div>
            <h1>예약 리스트</h1>
            <table style={{ width: '100%', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>예약자</th>
                        <th>매장</th>
                        <th>예약 시간</th>
                        <th>대기 상태</th>
                    </tr>
                </thead>
                <tbody>
                    {waitings.map((waiting, index) => (
                        <tr key={waiting.id}>
                            <td>{index + 1}</td>
                            <td>{waiting.user.name}</td>
                            <td>{waiting.partner.storeName}</td>
                            <td>{waiting.waitingRegDate}</td>
                            <td>{waiting.waitingState}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PartnerWaitingPage;
