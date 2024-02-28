import React, { useEffect, useReducer, useState } from 'react';
import { Client } from '@stomp/stompjs';

const initialState = {
    waitings: [],
    stompClient: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_WAITINGS':
            return { ...state, waitings: action.payload };
        case 'SET_STOMP_CLIENT':
            return { ...state, stompClient: action.payload };
        default:
            return state;
    }
};

const PartnerWaitingPage = ({ id }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [waitings, setWaitings] = useState([]);

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
            client.subscribe('/topic/waitingList', function (message) {
                const receivedWaitings = JSON.parse(message.body);
                dispatch({ type: 'SET_WAITINGS', payload: receivedWaitings });
                console.log('대기열이 업데이트되었습니다:', receivedWaitings);
            });
            client.subscribe('/topic/updateWaitingList', function (message) {
                // 예약 확정 후에도 대기열 정보를 업데이트
                fetchWaitings();
                console.log('웨이팅이 확정되었습니다:', message.body);
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
        fetchWaitings();
    }, [id]);

    const updateWaitingState = async (waitingId, newWaitingState) => {
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
            fetchWaitings();

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
                            <td>
                            {waiting.waitingState === 'WAITING' ? "예약승인" : 
                            waiting.waitingState === 'TRUE' ?  "완료" : 
                            waiting.waitingState === 'FALSE' ?  "예약취소" : ""}
                            </td>
                            <td>
                                {/* 버튼 클릭 시 대기 상태를 변경 */}
                                <button onClick={() => updateWaitingState(waiting.id, 'TRUE')}>
                                    완료
                                </button>
                                <button onClick={() => updateWaitingState(waiting.id, 'FALSE')}>
                                    예약취소
                                </button>
                                <button onClick={() => updateWaitingState(waiting.id, 'WAITING')}>
                                    예약승인
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
