// PartnerWaitingPage.js

import React, { useEffect, useReducer } from 'react';
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
            client.subscribe('/topic/waitingConfirmation', function (message) {
                const confirmedWaiting = JSON.parse(message.body);
                // 여기서 confirmedWaiting을 상태에 추가하거나, 기존 대기열에서 해당 웨이팅을 찾아 업데이트하는 등의 작업을 수행합니다.
                // 예를 들어, confirmedWaiting을 상태에 추가하는 경우:
                const updatedWaitings = [...state.waitings, confirmedWaiting];
                dispatch({ type: 'SET_WAITINGS', payload: updatedWaitings });
                console.log('웨이팅이 확정되었습니다:', confirmedWaiting);
            });
            dispatch({ type: 'SET_STOMP_CLIENT', payload: client });
            console.log('새로운 예약 목록:', client);
        };

        client.onStompError = function (frame) {
            console.error('웹소켓 연결 실패:', frame);
        };

        client.activate();

        return () => {
            client.deactivate();
            console.log('웹소켓 연결 해제');
        };
    }, [id]);

    // 대기 상태를 업데이트하는 함수
    const updateWaitingState = async (waitingId, newWaitingState) => {
        // 코드 생략...
    };

    return (
        <div>
            {/* 대기열 표시 및 대기 상태 변경 버튼 등의 UI 코드 */}
        </div>
    );
};

export default PartnerWaitingPage;
