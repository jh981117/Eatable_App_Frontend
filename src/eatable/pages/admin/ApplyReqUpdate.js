import React from "react";
import { Button, Container, Form} from "react-bootstrap";
import './ApplyReqUpdate.css';

const ApplyReqUpdate = () => {
  return (
    <div>
    <Container className="reqForm1">
      <h3 class="detailTitle1">가게 정보 수정</h3>     
      <h5 class="writeInfo1">매장 정보</h5>
      <Form className="infoForm1">
        <Form.Group controlId="storeName">
          <Form.Label>매장명</Form.Label>
          <Form.Control type="text" placeholder="매장명을 입력해주세요" readOnly/>
        </Form.Group>

        <Form.Group controlId="fullName">
          <Form.Label>문의자명</Form.Label>
          <Form.Control type="text" placeholder="성함을 입력해주세요" readOnly/>
        </Form.Group>

        <Form.Group controlId="number">
          <Form.Label>연락처</Form.Label>
          <Form.Control type="text" placeholder="연락처를 입력해주세요" readOnly/>
        </Form.Group>

        <Form.Group className="storeAddress" controlId="storeAddress">
          <Form.Label>매장주소</Form.Label>
          <Form.Control type="text" placeholder="매장주소를 입력해주세요" readOnly/>
        </Form.Group>
      
      <Form.Group controlId="status">
          <Form.Label>상태 변경</Form.Label>
          <div>
            <Form.Check type="radio" id="checkbox1"  name="status" label="open"/>               
            <Form.Check type="radio" id="checkbox2" name="status" label="close"/>               
          </div>
      </Form.Group>
      </Form>    
      <Button className="changebtn" variant="danger" type="submit">
             수정 신청
      </Button>
    </Container>
  </div>
  )
};

export default ApplyReqUpdate;
