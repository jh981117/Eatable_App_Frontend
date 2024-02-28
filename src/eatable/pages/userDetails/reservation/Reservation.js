import React, { useState, useEffect, useReducer } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { jwtDecode } from "jwt-decode";
import WaitingCount from "../item/WaitingCount";
import { Client } from "@stomp/stompjs";

const initialState = {
  showGreeting: false,
  selectedDate: setHours(setMinutes(new Date(), 30), 16),
  adultCount: 0,
  userId: "",
  reservationId: null,
  waitingCount: 0,
  stompClient: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SHOW_GREETING":
      return { ...state, showGreeting: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_ADULT_COUNT":
      return { ...state, adultCount: action.payload };
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "SET_RESERVATION_ID":
      return { ...state, reservationId: action.payload };
    case "SET_WAITING_COUNT":
      return { ...state, waitingCount: action.payload };
    case "SET_STOMP_CLIENT":
      return { ...state, stompClient: action.payload };
    default:
      return state;
  }
};

const Reservation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChangeDate = (date) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      dispatch({ type: "SET_USER_ID", payload: decoded.userId });
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      console.log("WebSocket 연결 성공");
      client.subscribe("/topic/waitingConfirmation", function (message) {
        // 웨이팅 확정 메시지 수신 시, 대기열 정보 업데이트
        fetchWaitings();
      });
      dispatch({ type: "SET_STOMP_CLIENT", payload: client });
    };

    client.onStompError = function (frame) {
      console.error("WebSocket 연결 실패:", frame);
    };

    client.activate();

    // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
  }, []);

  const fetchWaitings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/waiting/waitingList/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch waitings");
      }
      const data = await response.json();
      dispatch({ type: "SET_WAITINGS", payload: data });
    } catch (error) {
      console.error("Error fetching waitings:", error);
    }
  };

  const goReservationOk = () => {
    dispatch({ type: "SET_SHOW_GREETING", payload: true });
  };

  // 예약 확정 및 웨이팅 정보 요청
  const showReservationOk = async () => {
    const { selectedDate, adultCount, userId, stompClient } = state;
    const reservationData = {
      partnerId: id,
      userId: userId,
      people: adultCount,
      waitingRegDate: selectedDate.toISOString(),
      waitingState: "False",
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/waiting/addWaiting/` + id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save reservation");
      }

      const data = await response.json();
      dispatch({ type: "SET_RESERVATION_ID", payload: data.reservationId });
      alert("예약이 확정되었습니다.");

      if (stompClient) {
        // 대기열 정보 요청
        stompClient.publish({
          destination: "/app/updateWaitingList",
          body: JSON.stringify({ partnerId: id }),
        });
      }
    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  const {
    showGreeting,
    selectedDate,
    waitingCount,
    adultCount,
    reservationId,
  } = state;

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
      <hr />
      <Button onClick={goReservationOk}>다음</Button> <br />
      {showGreeting && (
        <>
          예약일 설정 <br />
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            showTimeSelect
            includeTimes={[
              setHours(setMinutes(new Date(), 0), 17),
              setHours(setMinutes(new Date(), 30), 17),
              setHours(setMinutes(new Date(), 0), 18),
              setHours(setMinutes(new Date(), 30), 18),
              setHours(setMinutes(new Date(), 0), 19),
              setHours(setMinutes(new Date(), 30), 19),
            ]}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <br />
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
      <div>현재 대기열 수: {waitingCount}</div>
    </div>
  );
};

export default Reservation;
