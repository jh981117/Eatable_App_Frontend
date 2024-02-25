import React, { useRef, useState, useEffect } from "react";
import { Container,Row,Col,Button,Form,Modal,Table,Pagination} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import zIndex from "@material-ui/core/styles/zIndex";
import styled from 'styled-components';

const StyledOption = styled.option`
 @media screen and (max-width: 600px) {
  font-size: 0.5rem;
 }
`;

const SelectMedia = styled(Form.Select)`
 @media screen and (max-width: 600px){
  font-size: 0.38rem;
 
 }
`;

const StyledTable = styled(Table)`
@media screen and (max-width: 600px) {
  th,
    td {
      font-size: 0.5rem; 
    }
}
`
const StyledButton = styled(Button)`

    padding: 4px 9px; 
    font-size: 1rem;    
    margin-top: 3px;

  @media screen and (max-width: 600px) {
    padding: 4px 9px; 
    font-size: 0.35rem;    
    margin-top: 3px;
  }
`;

const ApplyList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null); // 선택된 항목 상태 추가
  const [lists, setLists] = useState([]);
  const [selectedState, setSelectedState] = useState("ALL");
  const [disable, setDisable] = useState(JSON.parse(localStorage.getItem("disableState")) || []);
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const number =5;
  const navi = useNavigate();
 
 
  const update = (id) => {
    fetch(`http://localhost:8080/api/req/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ partnerReqState: "OPEN" }),
    }).then((response) => {
      console.log(`response`, response);
      if (response.status === 200) {
        return response.json();
      } else {
        return null;
      }
    });
  };

  const rejectUpdate = (id) => {
    fetch(`http://localhost:8080/api/req/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ partnerReqState: "WAIT" }),
    }).then((response) => {
      console.log(`response`, response);
      if (response.status === 200) {
        return response.json();
      } else {
        return null;
      }
    });
  };

  const handleOpenModal = (list) => {
    setSelectedList(list);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleReject = (id) => {
    const updatedList = lists.map((item) =>
      item.id === id ? { ...item, partnerReqState: "접수 거절" } : item
    );
    setLists(updatedList);
    rejectUpdate(id);
    handleCloseModal();
  };

  const handleApprove = (id) => {
    const updatedList = lists.map((item) =>
      item.id === id ? { ...item, partnerReqState: "접수 승인" } : item
    );
    setLists(updatedList);
    update(id);
    handleCloseModal();
  };


  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSelectChange = (e) => {  
    let url =`http://localhost:8080/api/req/totalListPage?page=${page}`;
    let selectFilter;
  
    if (e === "접수 대기중") {
      selectFilter = "OPEN_READY";
    } else if (e === "접수 승인") {
      selectFilter = "OPEN";
    } else if (e === "접수 거절") {
      selectFilter = "WAIT";
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
        const filteredData = data.content.filter(item => ["OPEN", "OPEN_READY", "WAIT"].includes(item.partnerReqState));
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
   
    const disableState = JSON.parse(localStorage.getItem("disableState"));
    if (disableState) {
      setDisable(disableState);
    }
  
    fetch(`http://localhost:8080/api/req/totalListPage?page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json(); // 응답에서 JSON 데이터 추출
      })
      .then((data) => {  
        const filteredData = data.content.filter(item => ["OPEN", "OPEN_READY", "WAIT"].includes(item.partnerReqState));
        const stateListData = filteredData.map(item => {
          switch (item.partnerReqState) {
            case "OPEN_READY":
              return { ...item, partnerReqState: "접수 대기중" };
            case "OPEN":
              return { ...item, partnerReqState: "접수 승인" };
            case "WAIT":
              return { ...item, partnerReqState: "접수 거절" };
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

  


  useEffect(() => {
    localStorage.setItem("disableState", JSON.stringify(disable));
  }, [disable]);

  // 선택된 상태에 따라 리스트 필터링
  const filteredLists =
    selectedState === "ALL"
      ? lists
      : lists.filter((item) => item.partnerReqState === selectedState);

  const clickUserId = (userId, id) => {
    setDisable((prevDisable) => ({
      ...prevDisable,
      [id]: true,
    }));

    // Redirect after setting disable
    setTimeout(() => {
      navi(`/partnerwrite/${userId}`);
    }, 0);

    console.log(userId);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <SelectMedia
              style={{ width: "13%"}}
              onChange={(e)=>handleSelectChange(e.target.value)}
            >
              <StyledOption value="ALL">모두 보기</StyledOption>
              <StyledOption value="접수 대기중">접수 대기중</StyledOption>
              <StyledOption value="접수 승인">접수 승인</StyledOption>
              <StyledOption value="접수 거절">접수 거절</StyledOption>
            </SelectMedia>
          </Col>
        </Row>
        <Row>
          <Col>
       
            <StyledTable striped bordered hover size="sm" className="list_table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>업체명</th>
                  <th>문의자명</th>
                  <th>상태</th>
                  <th>전화번호</th>
                  <th>신청날짜</th>
                  <th>유저아이디</th>
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
                          list.partnerReqState === "접수 거절"? "red": list.partnerReqState === "접수 승인"? "green": "blue",
                      }}
                    >
                      {list.partnerReqState}
                    </td>
                    <td>{list.phone}</td>
                    <td>{list.createdAt}</td>
                    <td>{list.userId}</td>
                    <td style={{ maxWidth: "65px", minWidth: "65px" }}>
                      {list.partnerReqState === "접수 승인" && (
                        <StyledButton
                          variant="outline-success me-2"
                          onClick={() => clickUserId(list.userId, list.id)}
                          disabled={disable[list.id]}
                        >
                          입점신청
                        </StyledButton>
                      )}
                     
                        {list.partnerReqState === "접수 대기중" && (
                          <>
                            <StyledButton
                              variant="outline-primary me-2"
                              onClick={() => handleOpenModal(list)}
                            >
                              승인
                            </StyledButton>
                            <StyledButton
                              variant="outline-danger"
                              onClick={() => handleReject(list.id)}
                            >
                              거절
                            </StyledButton>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </StyledTable>
          
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

      <Modal show={modalOpen} onHide={handleCloseModal}>
        <Modal.Body>정말 승인 하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Form>
            <Button
              variant="outline-primary me-2"
              onClick={() => handleApprove(selectedList.id)}
            >
              확인
            </Button>
          </Form>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplyList;