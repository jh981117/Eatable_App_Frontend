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
import emailjs from "@emailjs/browser";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

/////////

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("Token")}`, // 저장된 JWT를 헤더에 추가
  },
};

const ApplyList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [lists, setLists] = useState([]);

  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);

  const form = useRef();

  useEffect(() => {
    fetch("http://localhost:8080/api/req/totalList", config)
      .then((response) => response.json())
      .then((data) => {
        console.log("||||||||||" + data);
        setLists(data);
      });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_fch3yro1",
        "template_76jxtmb1",
        form.current,
        "ORegbfZuljHYVzE1s1"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    setModalOpen(false);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            <BarChart />
          </Col>
          <Col className="d-flex justify-content-center">
            <BarChart />
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center mb-4">
            <LineChart />
          </Col>
        </Row>
      </Container>
      <Container>
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
                </tr>
              </thead>
              <tbody>
                {lists.map((apply, index) => (
                  <tr key={index}>
                    <td>{apply.id}</td>
                    <td>{apply.storeName}</td>
                    <td>{apply.managerName}</td>
                    <td>{apply.partnerReqState}</td>
                    <td>{apply.phone}</td>
                    <td>{apply.regDate}</td>
                    <td>
                      <div className={"btn-wrapper"}>
                        <Button
                          variant="outline-primary me-2"
                          onClick={handleOpen}
                        >
                          승인
                        </Button>
                        <Button variant="outline-danger">거절</Button>
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
            <Form.Control
              type="hidden"
              name="user_email"
              value="imsen4@naver.com"
            />
            <Form.Control
              type="hidden"
              name="to_email"
              value="imsen456@gmail.com"
            />
            <Form.Control
              as="textarea"
              style={{ display: "none" }}
              name="message"
              value="부트스트랩 이게 맞냐 어?"
            />
            <Button
              className="finalOk"
              type="submit"
              variant="outline-primary me-2"
            >
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
