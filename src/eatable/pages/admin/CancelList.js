import React, {  useState, useEffect } from 'react';
import { Container, Row, Col,Button, Table, Form} from 'react-bootstrap';



const CancelList = () => {  
    const [lists, setLists] = useState([]);   
    const [selectedState, setSelectedState] = useState('ALL');
   const cancleUpdate = (id) => {          
      fetch(`http://localhost:8080/api/req/update/${id}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({partnerReqState: 'CLOSE'}),
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

    const cancelOk = (index) => {
      const updatelist = [...lists];
      updatelist[index].partnerReqState = "CLOSE"
      setLists(updatelist);
      cancleUpdate(updatelist[index].id);
      
      // const partnerId = updatelist[index].partnerId;
      // fetch(`http://localhost:8080/api/partner/update/${partnerId}`,{
      //    method: 'PUT',
      //    headers: {
      //     'Content-Type': 'application/json;charset=utf-8',
      //    },
      //    body: JSON.stringify({partnerState: false}),
      // })
      // .then((response) => {
      //   if(response.status === 200){
      //     return response.json();
      //   } else {
      //     return null;
      //   }
      // })
    } 

    const handleSelectChange = (e) => {
      setSelectedState(e.target.value);
    };

    useEffect(()=>{
      Promise.all([
            fetch("http://localhost:8080/api/req/stateList/CLOSE_READY"),
            fetch("http://localhost:8080/api/req/stateList/CLOSE")
          ])   
          .then(responses =>Promise.all(responses.map(response => response.json())))
          .then(data => {
            const list1 = data[0].map(i => ({...i,
              partnerReqState: i.partnerReqState === 'CLOSE_READY' ? '취소 대기중' : i.partnerReqState
             }));
            const list2 = data[1].map(i => ({...i,
              partnerReqState: i.partnerReqState === 'CLOSE' ? '취소 승인' : i.partnerReqState
            }));
             const cancelList = [...list1,...list2];
              setLists(cancelList);
          });
  },[])

  const filteredLists = selectedState === 'ALL' ? lists : lists.filter(item => item.partnerReqState === selectedState);

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Form.Select
                style={{ width: "13%" }}
                onChange={handleSelectChange}
              >
                <option value="ALL">모두 보기</option>
                <option value="취소 대기중">취소 대기중</option>
                <option value="취소 승인">접수 승인</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover size="sm" className="list_table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>업체명</th>
                    <th>문의자명</th>
                    <th>상태</th>
                    <th>전화번호</th>
                    <th>신청날짜</th>
                    <th>Y/N</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLists.map((list, index) => (
                    <tr key={index}>
                      <td>{list.id}</td>
                      <td>{list.storeName}</td>
                      <td>{list.managerName}</td>
                      <td
                        style={{
                          color:
                            list.partnerReqState === "취소 대기중"
                              ? "red"
                              : "blue",
                        }}
                      >
                        {list.partnerReqState === "CLOSE"
                          ? "취소 승인"
                          : list.partnerReqState}
                      </td>
                      <td>{list.phone}</td>
                      <td>{list.createdAt}</td>
                      <td style={{ maxWidth: "34px", minWidth: "34px" }}>
                        <div className={"btn-wrapper"}>
                          {list.partnerReqState === "취소 대기중" && (
                            <>
                              <Button
                                variant="outline-primary"
                                onClick={() => cancelOk(index)}
                              >
                                승인
                              </Button>
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