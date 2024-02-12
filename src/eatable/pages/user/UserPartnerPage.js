import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserPartnerPage = () => {
  const [stores, setStores] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 userId를 추출하는 함수
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error("토큰 디코딩 중 오류 발생:", error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("유저 ID를 찾을 수 없습니다.");
      return;
    }

    fetch("http://localhost:8080/api/partner/by-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setStores(data);
        if (data.length > 0 && data[0].fileList.length > 0) {
          setSelectedImage(data[0].fileList[0].imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching partners:", error);
      });
  }, []);
  console.log(stores, "???!");

  const updatePost = (id) => {
    navigate("/partnerupdate/" + id);
    console.log(id);
  };

  return (
    <div>
      <Container>
        <Card style={{ marginTop: "10px" }}>
          <Card.Body style={{ padding: "15px" }}>
            {" "}
            {/* Card.Body에 패딩 추가 */}
            <br />
            <br />
            <h2>매장관리</h2>
            <br />
            {stores.map((store, index) => (
              <div key={index}>
                <h4>{store.storeName}</h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    width: "100%", // 너비를 100%로 설정
                  }}
                >
                  <small>등록일 : {store.createdAt}</small>
                  {store.createdAt === store.updatedAt ? (
                    ""
                  ) : (
                    <small>수정일 : {store.updatedAt}</small>
                  )}
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <small>매장 번호 : {store.id}</small>
                  <small>관리자 번호 : {store.userId}</small>
                </div>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      width: "400px",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "25px",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {store.fileList.map((file, fIndex) => (
                    <img
                      key={fIndex}
                      src={file.imageUrl}
                      alt={`Store Image ${fIndex + 1}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        cursor: "pointer",
                        borderRadius: "40px", // 모서리를 둥글게
                      }}
                      onClick={() => setSelectedImage(file.imageUrl)}
                    />
                  ))}
                </div>

                <p>
                  매장상태 : {store.partnerState === "TRUE" ? "OPEN" : "Close"}
                </p>

                <p>관리자 이름 : {store.partnerName}</p>
                <p>매장 전화번호 : {store.storePhone}</p>
                <p>관리자 전화번호 : {store.partnerPhone}</p>
                <p>테이블 : {store.tableCnt}</p>
                <p>애완동물 : {store.dog === "TRUE" ? "가능" : "불가"}</p>
                <p>업종 : {store.favorite}</p>
                <p>주소 : {store.address.area}</p>
                <p>우편번호 : {store.address.zipCode}</p>
                <Button
                  className="button-link"
                  onClick={() => updatePost(store.id)}
                >
                  수정
                </Button>
              </div>
            ))}
          </Card.Body>
        </Card>

        <Card style={{ marginTop: "10px" }}>
          <h2>메뉴관리</h2>
          <br />
          <br />
        </Card>
      </Container>
    </div>
  );
};

export default UserPartnerPage;
