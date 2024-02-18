import React, {  useState, useEffect } from 'react';
import { Container, Row, Col,Button, Table, Form, Pagination} from 'react-bootstrap';



const CancelList = () => {  
    const [lists, setLists] = useState([]);   
    const [selectedState, setSelectedState] = useState('ALL');
    const [page, setPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const number = 2;
    const handlePageChange = (pageNumber) => {
      setPage(pageNumber);
    };
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

    const cancelOk = (id) => {
      const updatedList = lists.map((item) =>
      item.id === id ? { ...item, partnerReqState: "취소 승인" } : item
    );
    const listId = updatedList.find(item => item.id === id);
    console.log(listId)
      setLists(updatedList);
      cancleUpdate(id);
      console.log(updatedList)    
   
      fetch(`http://localhost:8080/api/partner/stateUpdate/${listId.userId}`,{
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json;charset=utf-8',
         },
         body: JSON.stringify({partnerState: false}),
      })
      .then((response) => {
        if(response.status === 200){
          return response.json();
        } else {
          return null;
        }
      })
    } 

    const handleSelectChange = (e) => {  
      let url =`http://localhost:8080/api/req/totalListPage?page=${page}`;
      let selectFilter;
    
      if (e === "취소 대기중") {
        selectFilter = "CLOSE_READY";
      } else if (e === "취소 승인") {
        selectFilter = "CLOSE"; 
      }
      if (selectFilter) {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            return response.json();
          })
          .then((data) => {
            const filteredData = data.content.filter(item => item.partnerReqState === selectFilter);
            console.log("",filteredData)
            const totalPages = Math.ceil(filteredData.length / number);
            setTotalPages(totalPages);
            console.log("",totalPages)
          setPage(0) 
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      } else {
        fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data) => {
          const filteredData = data.content.filter(item => ["CLOSE", "CLOSE_READY"].includes(item.partnerReqState));
          console.log("",filteredData)
          const totalPages = Math.ceil(filteredData.length / number);
          setTotalPages(totalPages);
          console.log("",totalPages)
          setPage(0)
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      }
    
      setSelectedState(e);
    };

    useEffect(() => {   
    
      fetch(`http://localhost:8080/api/req/totalListPage?page=${page}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json(); // 응답에서 JSON 데이터 추출
        })
        .then((data) => {  
          const filteredData = data.content.filter(item => ["CLOSE", "CLOSE_READY"].includes(item.partnerReqState));
          const stateListData = filteredData.map(item => {
            switch (item.partnerReqState) {
              case "CLOSE_READY":
                return { ...item, partnerReqState: "취소 대기중" };
              case "CLOSE":
                return { ...item, partnerReqState: "취소 승인" };              
              default:
                return null;
            }
          });
          setLists(stateListData);  
          console.log("크기||||||", filteredData.length); // switch를 통과하는 항목의 수
          setTotalPages(Math.ceil(filteredData.length / number)); // 총 페이지 수 설정
          console.log("||||", data); // 필터링된 항목들을 기반으로 페이지 수 설정                  
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);
  
  const filteredLists = selectedState === 'ALL' ? lists : lists.filter(item => item.partnerReqState === selectedState);

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Form.Select
                style={{ width: "13%" }}
                onChange={(e)=>handleSelectChange(e.target.value)}
              >
                <option value="ALL">모두 보기</option>
                <option value="취소 대기중">취소 대기중</option>
                <option value="취소 승인">취소 승인</option>
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
                  {filteredLists.sort((a,b)=> b.id - a.id).slice(page * number, (page + 1) * number).map((list) =>(
                    <tr key={list.id}>
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
                                onClick={() => cancelOk(list.id)}
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

        <div className="justify-content-center" style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
              {Array.from(Array(totalPages).keys()).map((pageNumber) => (
                <Pagination.Item key={pageNumber} active={pageNumber === page} onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
            </Pagination>
          </div>

      </div>
    );
};

export default CancelList;