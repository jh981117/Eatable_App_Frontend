import React, {  useState, useEffect } from 'react';
import { Container, Row, Col,Button, Table} from 'react-bootstrap';



const CancelList = () => {  
    const [lists, setLists] = useState([]);   
    const [button, setButton] = useState([]);

    const handleOpen = (index) => {
      const updatelist = [...lists];
      updatelist[index].partnerReqState = "CLOSE"
      setLists(updatelist);
      setButton( s => ({
        ...s,
        [index]: true,
      }));
    } 

    useEffect(()=>{
      fetch("http://localhost:8080/api/req/stateList/CLOSE_READY")
          .then(response => response.json())
          .then(data => {
            const list = data.map(i => ({...i,
              partnerReqState: i.partnerReqState === 'CLOSE_READY' ? '취소 대기중' : i.partnerReqState
            }));
              setLists(list);
          });
  },[])

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
                <td style={{ color: list.partnerReqState === 'CLOSE' ? 'blue' : 'red' }}>
                   {list.partnerReqState === 'CLOSE' ? '취소승인' : list.partnerReqState}                  
                  </td>
                <td>{list.phone}</td>
                <td>{list.regDate}</td>
              <td style={{maxWidth: '34px', minWidth:'34px'}}>
              <div className={'btn-wrapper'}>
              {!button[index] && (
                  <>
                    <Button variant="outline-primary"  onClick={() => handleOpen(index)}>승인</Button>               
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

      </div>
    );
};

export default CancelList;