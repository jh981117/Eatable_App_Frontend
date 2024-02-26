import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';

const PartnerWaitingPage = ({ id }) => {
    const [waitings, setWaitings] = useState([]);
    const [stompClient, setStompClient] = useState(null);

      // 웹소켓 연결
      useEffect(() => {
        const webSocket = new WebSocket('ws://localhost:8080/ws');
    
        webSocket.onopen = () => {
            console.log('WebSocket 연결 성공');
        };
    
        webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'waitingList') {
                setWaitings(data.waitingList);
            }
        };
    
        webSocket.onerror = (error) => {
            console.error('WebSocket 연결 에러:', error);
        };
    
        webSocket.onclose = () => {
            console.log('WebSocket 연결 종료');
        };
    
        return () => {
            webSocket.close();
        };
    }, []);

    // fetchWaitings 함수 정의
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
            console.log('대기열이 업데이트되었습니다:', data);
        } catch (error) {
            console.error('Error fetching waitings:', error);
        }
    };

    useEffect(() => {
        // useEffect 내에서 fetchWaitings 호출
        fetchWaitings();
    }, [id]);

    const updateWaitingState = async (waitingId, newWaitingState) => {
        // WaitingDto를 사용하여 waitingState를 문자열로 전송
        const waitingDto = {
            waitingState: newWaitingState
        };

        try {
            const response = await fetch(`http://localhost:8080/api/waiting/updateWaitingState/${id}/${waitingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(waitingDto) // WaitingDto를 JSON 문자열로 변환하여 전송
            });
            if (!response.ok) {
                throw new Error('Failed to update waiting state');
            }
            // 대기열 상태 업데이트 후 웹소켓을 통해 실시간으로 대기열을 다시 불러옴

            // 대기열 상태 업데이트 성공 시 로그 출력
            console.log('Waiting state updated successfully.');

        } catch (error) {
            console.error('Error updating waiting state:', error);
        }
    };


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
                        <th>대기 상태 변경</th> {/* 변경 버튼을 추가 */}
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
                            <td>
                                {/* 버튼 클릭 시 대기 상태를 변경 */}
                                <button onClick={() => updateWaitingState(waiting.id, 'TRUE')}>
                                    입장 완료
                                </button>
                                <button onClick={() => updateWaitingState(waiting.id, 'FALSE')}>
                                    입장 안함
                                </button>
                                <button onClick={() => updateWaitingState(waiting.id, 'WAITING')}>
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

export default PartnerWaitingPage;
