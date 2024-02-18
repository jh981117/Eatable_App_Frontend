import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, format } from 'date-fns';

const Reservation = () => {
    const navigate = useNavigate();
    let { id } = useParams();

    const [showGreeting, setShowGreeting] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );
    const [adultCount, setAdultCount] = useState(0);
    const [infantCount, setInfantCount] = useState(0);

    const handleChangeDate = (date) => {
        setSelectedDate(date);
    };

    const goReservationOk = () => {
        setShowGreeting(true);
        // 이후 예약확정 등 다른 작업 수행
        // navigate("/reservationOk");
    };

    const showReservationOk = () => {
        const reservationData = {
            partnerId: id,
            people: adultCount,
            waitingRegDate: selectedDate.toISOString(), // 서버에서 Date 형식으로 파싱하기 위해 ISO 문자열로 변환
            waitingState: "TRUE"
        };
    
        fetch(`http://localhost:8080/api/waiting/addWaiting/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        })
        .then(response => {
            if (response.ok) {
                // 예약 성공 시 처리
                navigate(`/reservationOk/${id}`);
            } else {
                // 예약 실패 시 처리
                throw new Error('Failed to save reservation');
            }
        })
        .catch(error => {
            console.error('Error saving reservation:', error);
            // 예약 실패 시 처리
        });
    };
    console.log(adultCount);
    console.log(selectedDate);
    return (
        <div>
            예약 인원 설정하기 <br />

            {/* 성인수 조절 버튼 */}
            <Button onClick={() => setAdultCount(adultCount > 0 ? adultCount - 1 : 0)}>-</Button>
            총원: {adultCount}
            <Button onClick={() => setAdultCount(adultCount + 1)}>+</Button>
            <br />

            <hr />

            <Button onClick={goReservationOk}>다음</Button> <br />
            {showGreeting && (
                <>
                예약일 설정 <br/>
                {/* Integrate the DatePicker */}
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
                    ]}  /*영업시간 설정*/
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                    <br />
                    <div className='text-center'>
                        <Button
                            style={{
                                fontSize: '1.5rem',
                                marginTop: '1rem',
                                width: '25rem',
                            }}
                            onClick={showReservationOk}
                        >
                            예약확정
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reservation;
