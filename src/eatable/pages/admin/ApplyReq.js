import React, {useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import './ApplyReq.css';

  const ApplyReq = () => {
    const [apply,setApply] = useState({
      managerName:'',
      storeName: '',
      phone: '',
      partnerReqState:'OPEN_READY',
      partner_id:'1',
      user_id:'',
    })
    const [error,setError] = useState();
    const changeValue = (e) => {
      setApply({
          ...apply, 
          [e.target.name]: e.target.value,
      });
  };
    const submitApply = (e)=>{
    
      e.preventDefault(); 
      const agreementCheckbox = document.getElementById('agreementCheckbox')     


      // if (!apply.store_name) {
      //   setApply({ ...apply, store_name: '매장명을 입력해주세요.' });     
      // } else {
      //   setApply({ ...apply, store_name: '' }); 
      //     }

      // if (!apply.manager_name) {
      //   setApply({ ...apply, manager_name: '문의자명을 입력해주세요.' });      
      // } else {
      //   setApply({ ...apply, manager_name: '' });
      // }

      // if (!apply.phone) {
      //   setApply({ ...apply, phone: '연락처를 입력해주세요.' });        
      // } else {
      //   setApply({ ...apply, phone: '' }); 
      // }

      // if (agreementCheckbox.checked) {
      //   setError('이용약관 동의를 체크해주세요');
      //   } else {
      //     setError('');
      // }

        fetch("http://localhost:8080/api/req/write", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(apply),
        })
          .then(response => {
            console.log(`response`, response);
            if (response.status === 201) {
              return response.json();
            } else {
              return null;
            }
          })
        
        }
   
    
    return (
      <div>
      <Container className="reqForm">
        <h3 class="detailTitle">가게 입점 신청</h3>
        <p class="detailInfo">신청서를 작성해 주시면 전문 상담사가 연락드려요!</p>
        <p class="detailInfo"> - 15시 이전 접수 당일 연락 / 15시 이후 접수 익일 오전 연락</p>
      
        <Form onSubmit={submitApply}>
        <div class="infoForm">
          <h5 class="writeInfo">매장 정보</h5>
        <Form.Group controlId="storeName">
            <Form.Label>매장명<span style={{color : 'red'}}>(필수)</span></Form.Label>
            <Form.Control className="strName" type="text" placeholder="매장명을 입력해주세요" onChange={changeValue} name="storeName"/>
          </Form.Group>
          {/* {apply.store_name && <div style={{ color: 'red' }}>{apply.store_name}</div>} */}

          <Form.Group controlId="fullName">
            <Form.Label>문의자명<span style={{color : 'red'}}>(필수)</span></Form.Label>
            <Form.Control className="personName" type="text" placeholder="성함을 입력해주세요" onChange={changeValue} name="managerName"/>
          </Form.Group>
          {/* {apply.manager_name && <div style={{ color: 'red' }}>{apply.manager_name}</div>} */}

          <Form.Group controlId="number">
            <Form.Label>연락처<span style={{color : 'red'}}>(필수)</span></Form.Label>
            <Form.Control type="text" placeholder="연락처를 입력해주세요" onChange={changeValue} name="phone"/>
          </Form.Group>
          {/* {apply.phone && <div style={{ color: 'red' }}>{apply.phone}</div>} */}
          
        </div> 
          <h5 class="checkInfo">약관 동의</h5>       
          <div className="agreementForm">
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
          </div>
          <Form.Check  id="agreementCheckbox" className="agreeCheck" type="checkbox" label="개인정보 수집 및 이용 동의 (필수)" />
          {/* {error && <div style={{ color: 'red' }}>{error}</div>}           */}
            <Button className="reqbtn" variant="primary" type="submit">
                등록 신청
          </Button>
        </Form>

      
      </Container>
    </div>
    )
  };
  
export default ApplyReq;
