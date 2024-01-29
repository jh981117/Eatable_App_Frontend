import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Reservation = () => {
    const navigate = useNavigate();

    let {id} = useParams();

    const [showGreeting, setShowGreeting] = useState(false);

    const goReservationOk = () => {
        setShowGreeting(true);
        // 이후 예약확정 등 다른 작업 수행
        // navigate("/reservationOk");
    };

    return (
        <div>
            예약 인원 설정하기 <br />
            성인 <br />
            유아
            <hr />
            총원
            <Button onClick={goReservationOk}>다음</Button> <br />
            {showGreeting && (
                <>
                    ㅎㅇㅎㅇ
                    <br />
                    <div className='text-center'>
                    <Button style={{ fontSize: '1.5rem', marginTop: '1rem', width: '25rem' }} onClick={() => navigate("/reservationOk/")}>
                        예약확정
                    </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reservation;
