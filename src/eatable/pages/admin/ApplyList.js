import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col,Button, Form, Modal, Table} from 'react-bootstrap';
import emailjs from "@emailjs/browser";


const ApplyList = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [lists, setLists] = useState([]);   
    const [button, setButton] = useState([]);
    const handleClose = () => setModalOpen(false);
    const handleOpen = () => setModalOpen(true);

    const handleReject = (index) => {
      const updatelist = [...lists];
      updatelist[index].partnerReqState = "접수 거절"
      setLists(updatelist);
      setButton( s => ({
        ...s,
        [index]: true,
      }));
    }
    const form = useRef();

    useEffect(()=>{
      fetch("http://localhost:8080/api/req/stateList/OPEN_READY")
          .then(response => response.json())
          .then(data => {
            const list = data.map(i => ({...i,
              partnerReqState: i.partnerReqState === 'OPEN_READY' ? '접수 대기중' : i.partnerReqState
            }));
              setLists(list);
          });
  },[])

    const sendEmail = (e) => {
      e.preventDefault();  

      emailjs.sendForm('service_fch3yro1', 'template_76jxtmb1', form.current, 'ORegbfZuljHYVzE1s1')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        setModalOpen(false);
    };

    return (
      <div>  
        <Container>               
            <Row>
              <Col >
              <Table striped bordered hover size='sm' className="list_table">
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
            {lists.map((list, index) => (
              <tr key={index}>      
                <td>{list.id}</td>
                <td>{list.storeName}</td>
                <td>{list.managerName}</td>
                <td style={{ color: list.partnerReqState === '접수 거절' ? 'red' : (list.partnerReqState ==='접수 완료'?'green' :'blue' )}}>
                  {list.partnerReqState}
                  </td>
                <td>{list.phone}</td>
                <td>{list.regDate}</td>
              <td style={{maxWidth: '65px', minWidth:'65px'}}>
              <div className={'btn-wrapper'}>
              {!button[index] && (
                  <>
                    <Button variant="outline-primary me-2" onClick={handleOpen}>승인</Button>
                    <Button variant="outline-danger" onClick={() => handleReject(index)}>거절</Button>
                  </>
                )}
              </div>
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
                  <Form ref={form} onSubmit={sendEmail}>
                    <Form.Control type="hidden" name="user_name" value="부트스트랩" />
                    <Form.Control type="hidden" name="user_email" value="imsen4@naver.com" />
                    <Form.Control type="hidden" name="to_email" value="imsen456@gmail.com" />
                    <Form.Control as="textarea" style={{ display: 'none' }} name="message" value="부트스트랩 이게 맞냐 어?" />
                    <Button className="finalOk" type="submit" variant="outline-primary me-2">
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
