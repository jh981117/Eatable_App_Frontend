import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Table } from 'react-bootstrap';
import emailjs from "@emailjs/browser";
import { useNavigate } from 'react-router-dom';

const ApplyList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [lists, setLists] = useState([]);  
    const [index, setIndex] = useState(null); // 선택된 행의 인덱스 상태 추가
    const [selectedState, setSelectedState] = useState('ALL');
    const navi = useNavigate();

    const update = (id) => {          
      fetch(`http://localhost:8080/api/req/update/${id}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({partnerReqState: 'OPEN'}),
      })
        .then((response) => {
          console.log(`response`, response);
          if (response.status === 200) {       
            return response.json();
          } else {
            return null;
          }
        })
    };

    const rejectUpdate = (id) => {          
      fetch(`http://localhost:8080/api/req/update/${id}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({partnerReqState: 'WAIT'}),
      })
        .then((response) => {
          console.log(`response`, response);
          if (response.status === 200) {       
            return response.json();
          } else {
            return null;
          }
        })
    };
    const handleClose = () => {
        setModalOpen(false);
    };

    const handleOpen = (index) => {
        setModalOpen(true);
        setIndex(index);
    };

    const handleReject = (index) => {
        const updatedList = [...lists];
        updatedList[index].partnerReqState = '접수 거절';
        setLists(updatedList);  
        rejectUpdate(updatedList[index].id);       
    };

    const handleApprove = () => {
        const updatedList = [...lists];
        updatedList[index].partnerReqState = '접수 승인';
        setLists(updatedList);
        update(updatedList[index].id);
        setModalOpen(false);
    };

    const handleSelectChange = (e) => {
      setSelectedState(e.target.value);
    };

    const form = useRef();

    useEffect(() => {
      Promise.all([
          fetch("http://localhost:8080/api/req/stateList/OPEN_READY"),
          fetch("http://localhost:8080/api/req/stateList/OPEN"),
          fetch("http://localhost:8080/api/req/stateList/WAIT"),         
      ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
          const list1 = data[0].map(i => ({
              ...i,
              partnerReqState: i.partnerReqState === 'OPEN_READY' ? '접수 대기중' : i.partnerReqState
          }));
          const list2 = data[1].map(i => ({
              ...i,
              partnerReqState: i.partnerReqState === 'OPEN' ? '접수 승인' : i.partnerReqState
          }));
          const list3 = data[2].map(i => ({
            ...i,
            partnerReqState: i.partnerReqState === 'WAIT' ? '접수 거절' : i.partnerReqState
        }));
           const reqList = [...list1, ...list2, ...list3];
          setLists(reqList);        
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
// 선택된 상태에 따라 리스트 필터링
const filteredLists = selectedState === 'ALL' ? lists : lists.filter(item => item.partnerReqState === selectedState);

  return (
    <div>
      <Container>
      <Row>
          <Col>
            <Form.Select style={{width: '13%'}} onChange={handleSelectChange}>
              <option value="ALL">모두 보기</option>
              <option value="접수 대기중">접수 대기중</option>
              <option value="접수 승인">접수 승인</option>
              <option value="접수 거절">접수 거절</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover size='sm' className='list_table'>
              <thead>
                <tr>
                  <th>id</th>
                  <th>업체명</th>
                  <th>문의자명</th>
                  <th>상태</th>
                  <th>전화번호</th>
                  <th>신청날짜</th>
                </tr>
              </thead>

             <tbody>
                {filteredLists.map((list, index) => (
                  <tr key={index}>
                    <td>{list.id}</td>
                    <td>{list.storeName}</td>
                    <td>{list.managerName}</td>
                    <td style={{ color: list.partnerReqState === '접수 거절' ? 'red' : (list.partnerReqState === '접수 승인' ? 'green' : 'blue') }}>
                        {list.partnerReqState}
                    </td>
                    <td>{list.phone}</td>
                    <td>{list.regDate}</td>
                    <td style={{ maxWidth: '65px', minWidth: '65px' }}>
                        {list.partnerReqState === '접수 승인' && (
                            <Button variant="outline-success me-2" onClick={() => navi('/partnerwrite')}>입점신청</Button>
                        )}
                        {list.partnerReqState === '접수 대기중' && (
                            <>
                                <Button variant="outline-primary me-2" onClick={() => handleOpen(index)}>승인</Button>
                                <Button variant="outline-danger" onClick={() => handleReject(index)}>거절</Button>
                            </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
    </Container>

    <Modal show={modalOpen}>
        <Modal.Body>정말 승인 하시겠습니까?</Modal.Body>
        <Modal.Footer>
            <Form ref={form} >
                <Form.Control type="hidden" name="user_name" value="부트스트랩" />
                <Form.Control type="hidden" name="user_email" value="imsen4@naver.com" />
                <Form.Control type="hidden" name="to_email" value="imsen456@gmail.com" />
                <Form.Control as="textarea" style={{ display: 'none' }} name="message" value="부트스트랩 이게 맞냐 어?" />
                <Button variant="outline-primary me-2" onClick={handleApprove}>
                    확인
                </Button>
            </Form>
            <Button variant="outline-secondary" onClick={handleClose}>
                닫기
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplyList;