import React, {useEffect, useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import './ApplyReq.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



  const ApplyReq = () => {
    const [apply, setApply] = useState({
      managerName: "",
      storeName: "",
      phone: "",
      partnerReqState: "OPEN_READY",
      userId: "",
      
    });

    console.log(apply)
    const [error, setError] = useState("");
    const [storeName, setStoreName] = useState("");
    // const [managerName, setManagerName] = useState("");
    const [phone, setPhone] = useState("");

    const [isPartner, setIsPartner] = useState(null); // 파트너 여부 상태 추가
    const navi = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const roles = decoded.auth ? decoded.auth.split(",") : [];
          setIsPartner(roles.includes("ROLE_PARTNER"));
          console.log(decoded)
          // 폼 상태에 사용자 ID 추가
       setApply((prev) => ({
         ...prev,
         userId: decoded.userId, // userId를 상태에 추가
         managerName: decoded.name, // 매니저 이름을 상태에 추가
       }));
          console.log(apply)
        } catch (error) {
          console.error("토큰 디코딩 중 오류 발생:", error);
        }
      }
    }, []);




    const changeValue = (e) => {
      setApply({
        ...apply,
        [e.target.name]: e.target.value,
      });
    };
    const submitApply = (e) => {
      e.preventDefault();
      const agreementCheckbox = document.getElementById("agreementCheckbox");

      if (!apply.storeName) {
        setStoreName("매장명을 입력해주세요.");
      } else {
        setStoreName("");
      }

      // if (!apply.managerName) {
      //   setManagerName("문의자명을 입력해주세요.");
      // } else {
      //   setManagerName("");
      // }

      if (!apply.phone) {
        setPhone("연락처를 입력해주세요.");
      } else {
        setPhone("");
      }

      if (!agreementCheckbox.checked) {
        setError("이용약관 동의를 체크해주세요");
      } else {
        setError("");
      }

      fetch("http://localhost:8080/api/req/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(apply),
      })
        .then((response) => {
          console.log(`response`, response);
          if (response.status === 201) {
            return response.json();
          } else {
            return null;
          }
        })
        .then((data) => {
          if (data !== null) {
            alert("제출완료");
            navi("/")
          } else {
            alert("제출실패");
          }
        });
    };

    if (isPartner === true) {
    return <div>죄송합니다. 1개의 아이디에 하나의 스토어만 신청 가능합니다.</div>;
  } else if (isPartner === false) {


    return (
      <div>
        <Container className="reqForm">
          <h3 class="detailTitle">가게 입점 신청</h3>
          <p class="detailInfo">
            신청서를 작성해 주시면 전문 상담사가 연락드려요!
          </p>
          <p class="detailInfo">
            {" "}
            - 15시 이전 접수 당일 연락 / 15시 이후 접수 익일 오전 연락
          </p>

          <Form onSubmit={submitApply}>
            <div class="infoForm">
              <h5 class="writeInfo">매장 정보</h5>

              <Form.Group controlId="fullName">
                <Form.Label>문의자명</Form.Label>
                <Form.Control
                  className="personName"
                  type="text"
                  value={apply.managerName} 
                  readOnly={true} 
                  name="managerName"
                />
              </Form.Group>
              <Form.Group controlId="storeName">
                <Form.Label>
                  매장명<span style={{ color: "red" }}>(필수)</span>
                </Form.Label>
                <Form.Control
                  className="strName"
                  type="text"
                  placeholder="매장명을 입력해주세요"
                  onChange={changeValue}
                  name="storeName"
                />
              </Form.Group>
              {storeName && <div style={{ color: "red" }}>{storeName}</div>}

              {/* {managerName && <div style={{ color: "red" }}>{managerName}</div>} */}

              <Form.Group controlId="number">
                <Form.Label>
                  연락처<span style={{ color: "red" }}>(필수)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="연락처를 입력해주세요"
                  onChange={changeValue}
                  name="phone"
                />
              </Form.Group>

              <Form.Group controlId="memo">
                <Form.Label>기타문의</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="문의사항을 입력해주세요"
                  onChange={changeValue}
                  name="memo"
                />
              </Form.Group>
              {phone && <div style={{ color: "red" }}>{phone}</div>}
            </div>
            <h5 class="checkInfo">약관 동의</h5>
            <div className="agreementForm">
              <Form.Group controlId="agreement">
                <Form.Text className="text-muted">
                  <p class="infoTitle">개인정보 수집 및 이용에 대한 안내 </p>
                  <p>
                    ㈜와드는 입점·문의사항 접수시, 최소한의 범위 내에서 아래와
                    같이 개인정보를 수집·이용 합니다. 처리결과 회신이 콜센터를
                    통해 진행될 경우, 상담원과의 통화는 녹취될 수 있습니다.
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
                        <td>
                          매장명, 이름, 연락처, 월 평균 예약건수, 관심분야
                        </td>
                        <td>입점, 문의사항 접수 및 처리결과 회신</td>
                      </tr>
                    </tbody>
                  </Table>
                  <p>
                    2. 수집 및 이용 목적 : 입점, 문의사항 접수 및 처리결과 회신
                  </p>
                  <p>
                    3. 개인정보의 이용기간 : 목적 달성 후, 해당 개인정보를
                    지체없이 파기
                  </p>
                  <p>
                    위 개인정보 수집‧이용에 대한 동의를 거부할 권리가 있습니다.
                    다만 동의를 거부하는 경우 입점·문의사항 접수가 제한될 수
                    있습니다.
                  </p>
                </Form.Text>
              </Form.Group>
            </div>
            <Form.Check
              id="agreementCheckbox"
              className="agreeCheck"
              type="checkbox"
              label="개인정보 수집 및 이용 동의 (필수)"
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Button className="reqbtn" variant="primary" type="submit">
              등록 신청
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
  };
  
export default ApplyReq;
