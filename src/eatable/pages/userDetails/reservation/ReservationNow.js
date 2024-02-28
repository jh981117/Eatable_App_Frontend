
import React, { useState, useEffect, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WaitingCount from '../item/WaitingCount';
import { Client } from '@stomp/stompjs';

const initialState = {
    showGreeting: false,
    adultCount: 0,
    userId: '',
    reservationId: null,
    webSocket: null, // 웹소켓 상태 추가
    stompClient: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SHOW_GREETING':
            return { ...state, showGreeting: action.payload };
        case 'SET_ADULT_COUNT':
            return { ...state, adultCount: action.payload };
        case 'SET_USER_ID':
            return { ...state, userId: action.payload };
        case 'SET_RESERVATION_ID':
            return { ...state, reservationId: action.payload };
        case 'SET_STOMP_CLIENT':
            return { ...state, stompClient: action.payload };
        default:
            return state;
    }

};

// 실시간 예약 페이지
const ReservationNow = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태 변수

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            dispatch({ type: 'SET_USER_ID', payload: decoded.userId });
        }
    }, []);

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
            console.log('WebSocket 연결 성공');
            client.subscribe('/topic/reservationConfirmation', function (message) {
                // 웨이팅 확정 메시지 수신 시, 대기열 정보 업데이트
                fetchReservations();
            });
            dispatch({ type: 'SET_STOMP_CLIENT', payload: client });
        };

        client.onStompError = function (frame) {
            console.error('WebSocket 연결 실패:', frame);
        };

        client.activate();

        
 
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/reservation/reservationList/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            dispatch({ type: 'SET_RESERVATIONS', payload: data });
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };



      webSocket.onerror = (error) => {
        console.error("WebSocket 연결 에러:", error);
      };

      webSocket.onclose = () => {
        console.log("WebSocket 연결 종료");
      };


    const showReservationOk = async () => {
        const { adultCount, userId, stompClient } = state;
        const reservationData = {
            partnerId: id,
            userId: userId,
            people: adultCount,
            reservationRegDate: new Date().toISOString(),
            reservationState: "False"
        };
    
        try {
            const response = await fetch(`http://localhost:8080/api/reservation/addReservation/` + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (!response.ok) {
                throw new Error('Failed to save reservation');
            }

            const data = await response.json();
            dispatch({ type: 'SET_RESERVATION_ID', payload: data.reservationId });
            alert('예약이 확정되었습니다.');

            if (stompClient) {
                // 대기열 정보 요청
                stompClient.publish({
                    destination: '/topic/updateReservationList',
                    body: JSON.stringify({ partnerId: id }),
                });
            }
        } catch (error) {
            console.error('Error saving reservation:', error);
        }

    };

    fetch(`http://localhost:8080/api/reservation/addReservation/` + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to save reservation");
        }
      })
      .then((data) => {
        dispatch({ type: "SET_RESERVATION_ID", payload: data.reservationId });
        alert("예약이 확정되었습니다.");

        if (webSocket) {
          // 웹소켓이 연결되어 있다면 메시지 전송
          webSocket.send(
            JSON.stringify({ action: "updateWaitingCount", partnerId: id })
          );
        }
      })
      .catch((error) => {
        console.error("Error saving reservation:", error);
      });
  };

  const { showGreeting, adultCount, reservationId } = state;

  return (
    <div>
      예약 인원 설정하기 <br />
      <Button
        onClick={() =>
          dispatch({
            type: "SET_ADULT_COUNT",
            payload: Math.max(adultCount - 1, 0),
          })
        }
      >
        -
      </Button>
      총원: {adultCount}
      <Button
        onClick={() =>
          dispatch({ type: "SET_ADULT_COUNT", payload: adultCount + 1 })
        }
      >
        +
      </Button>
      <br />
      <hr />
      <Button onClick={goReservationOk}>다음</Button> <br />
      {showGreeting && (
        <>
          <div className="text-center">
            <Button
              style={{
                fontSize: "1.5rem",
                marginTop: "1rem",
                width: "25rem",
              }}
              onClick={showReservationOk}
            >
              예약확정
            </Button>
            {reservationId && (
              <WaitingCount partnerId={id} reservationId={reservationId} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReservationNow;
