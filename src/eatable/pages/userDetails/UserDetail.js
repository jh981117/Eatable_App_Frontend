import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MenuSection from './menuComponents/MenuSection';

const UserDetail = () => {

    const navigate = useNavigate();

    let {id} = useParams();

    const goReservation = () => {
        navigate("/reservation/")}

    return (
        <Container>
            <Row>
                <Col>
                    <div>매장사진</div>
                    <hr />
                    <div>매장정보</div>
                    <hr />
                    <div>매장예약현황</div>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 36 36">
                            <path fill="currentColor" d="M28 30H16v-8h-2v8H8v-8H6v8a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-8h-2Z"/>
                            <path fill="currentColor" d="m33.79 13.27l-4.08-8.16A2 2 0 0 0 27.92 4H8.08a2 2 0 0 0-1.79 1.11l-4.08 8.16a2 2 0 0 0-.21.9v3.08a2 2 0 0 0 .46 1.28A4.67 4.67 0 0 0 6 20.13a4.72 4.72 0 0 0 3-1.07a4.73 4.73 0 0 0 6 0a4.73 4.73 0 0 0 6 0a4.73 4.73 0 0 0 6 0a4.72 4.72 0 0 0 6.53-.52a2 2 0 0 0 .47-1.28v-3.09a2 2 0 0 0-.21-.9M15 14.4v1.52L14.18 17a2.71 2.71 0 0 1-4.37 0L9 15.88V14.4L11.59 6H16Zm12 1.48L26.19 17a2.71 2.71 0 0 1-4.37 0L21 15.88V14.4L20 6h4.45L27 14.4Z"/>
                            <path fill="none" d="M0 0h36v36H0z"/>
                        </svg>
                        {''} 매장 웨이팅 5팀이 있습니다  {''}
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <g fill="none">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8V7a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v1"/>
                                <path fill="currentColor" fill-rule="evenodd" d="M3.586 7.586C3 8.172 3 9.114 3 11v3c0 3.771 0 5.657 1.172 6.828C5.343 22 7.229 22 11 22h2c3.771 0 5.657 0 6.828-1.172C21 19.657 21 17.771 21 14v-3c0-1.886 0-2.828-.586-3.414C19.828 7 18.886 7 17 7H7c-1.886 0-2.828 0-3.414.586M10 12a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0zm6 0a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0z" clip-rule="evenodd"/>
                            </g>
                        </svg>
                        {''} 포장 웨이팅 5팀이 있습니다
                    </div>
                    <div>
                        <br /><br />
                        <MenuSection/>
                    </div>
                    <div className='text-center'>
                    <Button style={{ fontSize: '1.5rem', marginTop: '1rem', width: '25rem' }} onClick={goReservation}>예약하기</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDetail;
