import React, { useState, useEffect } from 'react';

const WaitingCount = ({ partnerId, reservationId }) => {
    const [waitingCount, setWaitingCount] = useState(0);

    useEffect(() => {
        // API 호출하여 대기자 수 가져오기
        fetch(`http://localhost:8080/api/reservation/userWaitingCount/${partnerId}/${reservationId}`)
            .then(response => response.json())
            .then(data => {
                // API 응답에서 대기자 수를 가져와 상태에 설정
                setWaitingCount(data);
            })
            .catch(error => {
                console.error('Error fetching waiting count:', error);
            });
    }, [partnerId, reservationId]); // partnerId와 reservationId가 변경될 때마다 호출

    return (
        <div>
            대기 중인 팀: {waitingCount}
        </div>
    );
};

export default WaitingCount;
