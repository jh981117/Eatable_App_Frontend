import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Table,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

const ApplyList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null); // 선택된 항목 상태 추가
  const [lists, setLists] = useState([]);
  const [selectedState, setSelectedState] = useState("ALL");
  const [disable, setDisable] = useState(JSON.parse(localStorage.getItem("disableState")) || []);

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

  const handleSelectChange = (e) => {
    setSelectedState(e.target.value);
  };

  useEffect(() => {
    const disableState = JSON.parse(localStorage.getItem("disableState"));
    if (disableState) {
      setDisable(disableState);
    }

    Promise.all([
      fetch("http://localhost:8080/api/req/stateList/OPEN_READY"),
      fetch("http://localhost:8080/api/req/stateList/OPEN"),
      fetch("http://localhost:8080/api/req/stateList/WAIT"),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        const list1 = data[0].map((i) => ({
          ...i,
          partnerReqState:
            i.partnerReqState === "OPEN_READY"
              ? "접수 대기중"
              : i.partnerReqState,
        }));
        const list2 = data[1].map((i) => ({
          ...i,
          partnerReqState:
            i.partnerReqState === "OPEN" ? "접수 승인" : i.partnerReqState,
        }));
        const list3 = data[2].map((i) => ({
          ...i,
          partnerReqState:
            i.partnerReqState === "WAIT" ? "접수 거절" : i.partnerReqState,
        }));
        const reqList = [...list1, ...list2, ...list3];
        setLists(reqList);
        console.log(reqList);
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
            <Form.Select
              style={{ width: "13%" }}
              onChange={handleSelectChange}
            >
              <option value="ALL">모두 보기</option>
              <option value="접수 대기중">접수 대기중</option>
              <option value="접수 승인">접수 승인</option>
              <option value="접수 거절">접수 거절</option>
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
                  <th>유저아이디</th>
                </tr>
              </thead>

              <tbody>
                {filteredLists.map((list) => (
                  <tr key={list.id}>
                    <td>{list.id}</td>
                    <td>{list.storeName}</td>
                    <td>{list.managerName}</td>
                    <td
                      style={{
                        color:
                          list.partnerReqState === "접수 거절"
                            ? "red"
                            : list.partnerReqState === "접수 승인"
                            ? "green"
                            : "blue",
                      }}
                    >
                      {list.partnerReqState}
                    </td>
                    <td>{list.phone}</td>
                    <td>{list.createdAt}</td>
                    <td>{list.user}</td>
                    <td style={{ maxWidth: "65px", minWidth: "65px" }}>
                      {list.partnerReqState === "접수 승인" && (
                        <Button
                          variant="outline-success me-2"
                          onClick={() => clickUserId(list.userId, list.id)}
                          disabled={disable[list.id]}
                        >
                          입점신청
                        </Button>
                      )}
                      {list.partnerReqState === "접수 대기중" && (
                        <>
                          <Button
                            variant="outline-primary me-2"
                            onClick={() => handleOpenModal(list)}
                          >
                            승인
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleReject(list.id)}
                          >
                            거절
                          </Button>
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

      <Modal show={modalOpen} onHide={handleCloseModal}>
        <Modal.Body>정말 승인 하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Form>
            <Button variant="outline-primary me-2" onClick={() => handleApprove(selectedList.id)}>
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
