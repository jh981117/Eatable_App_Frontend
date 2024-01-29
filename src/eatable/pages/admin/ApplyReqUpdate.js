import React from "react";
import { Button, Container, Form} from "react-bootstrap";
import './ApplyReqUpdate.css';

const ApplyReqUpdate = () => {
  return (
    <div>
    <Container className="reqForm1">
      <h3 class="detailTitle1">가게 입점 취소</h3> 
       
      <h5 class="writeInfo1">매장 정보</h5>
      <Form>
       <div  className="infoForm1"> 
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
        
        <Form.Group controlId="status">
            <Form.Label>상태 변경</Form.Label>
            <div>
              <Form.Check type="radio" id="checkbox1"  name="status" label="open" defaultChecked/>               
              <Form.Check type="radio" id="checkbox2" name="status" label="close"/>               
            </div>
        </Form.Group>
        </div> 
        <Button className="changebtn" variant="danger" type="submit">
             취소 승인
        </Button>
      </Form>    
      
    </Container>
  </div>
  )
};

export default ApplyReqUpdate;
