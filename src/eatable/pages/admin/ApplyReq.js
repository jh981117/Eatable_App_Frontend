import React from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import './ApplyReq.css';

const ApplyReq = () => {
  return (
    <div>
    <Container className="reqForm">
      <h3 class="detailTitle">가게 입점 신청</h3>
      <p class="detailInfo">신청서를 작성해 주시면 전문 상담사가 연락드려요!</p>
      <p class="detailInfo"> - 15시 이전 접수 당일 연락 / 15시 이후 접수 익일 오전 연락</p>
      <h5 class="writeInfo">매장 정보</h5>
      <Form className="infoForm">
        <Form.Group controlId="storeName">
          <Form.Label>매장명</Form.Label>
          <Form.Control type="text" placeholder="매장명을 입력해주세요" />
        </Form.Group>

        <Form.Group controlId="fullName">
          <Form.Label>문의자명</Form.Label>
          <Form.Control type="text" placeholder="성함을 입력해주세요" />
        </Form.Group>

        <Form.Group controlId="number">
          <Form.Label>연락처</Form.Label>
          <Form.Control type="text" placeholder="연락처를 입력해주세요" />
        </Form.Group>

        <Form.Group controlId="storeAddress">
          <Form.Label>매장주소</Form.Label>
          <Form.Control type="text" placeholder="매장주소를 입력해주세요" />
        </Form.Group>
      </Form>

      <h5 class="checkInfo">약관 동의</h5> 
      <Form.Check type="checkbox" label="개인정보 수집 및 이용 동의 (필수)" />
      <Form className="agreementForm">
        <Form.Group controlId="agreement">         
          <Form.Text className="text-muted">
            <p class="infoTitle">개인정보 수집 및 이용에 대한 안내 </p>
            <p>
              ㈜와드는 입점·문의사항 접수시, 최소한의 범위 내에서 아래와 같이 개인정보를 수집·이용 합니다.

              처리결과 회신이 콜센터를 통해 진행될 경우, 상담원과의 통화는 녹취될 수 있습니다.
            </p>
            <p>1. 수집하는 개인정보 항목</p>
              <Table bordered className="infoTable">
                <thead>
                  <tr>
                    <th>수집하는 개인정보 항목</th>
                    <th>수집 및 이용 목적</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>매장명, 이름, 연락처, 월 평균 예약건수, 관심분야</td>
                    <td>입점, 문의사항 접수 및 처리결과 회신</td>
                  </tr>
                </tbody>
              </Table>        
            <p>2. 수집 및 이용 목적 : 입점, 문의사항 접수 및 처리결과 회신</p>
            <p>3. 개인정보의 이용기간 : 목적 달성 후, 해당 개인정보를 지체없이 파기</p> 
            <p>위 개인정보 수집‧이용에 대한 동의를 거부할 권리가 있습니다.
               다만 동의를 거부하는 경우 입점·문의사항 접수가 제한될 수 있습니다.</p>           
          </Form.Text>
        </Form.Group>
      </Form>
      <Button className="reqbtn" variant="primary" type="submit">
             등록 신청
      </Button>
    </Container>
  </div>
  )
};

export default ApplyReq;
