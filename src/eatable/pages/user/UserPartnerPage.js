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
    if (stores.fileList && stores.fileList.length > 0) {
      setSelectedImage(stores.fileList[0].imageUrl); // 첫 번째 이미지를 선택된 이미지로 설정
    } else {
      setSelectedImage(
        "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707717950973-eatabel-1.png"
      ); // 기본 이미지 설정
    }
  }, [stores.fileList]); // store.fileList가 변경될 때마다 효과를 다시 실행

  

   const fetchStores = (userId) => {
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
};

useEffect(() => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("유저 ID를 찾을 수 없습니다.");
    return;
  }
  fetchStores(userId); // 매장 정보를 불러오는 함수 호출
}, []);

  console.log(stores, "???!!!!!!!");

  const updatePost = (id) => {
    navigate("/partnerupdate/" + id);
    console.log(id);
  };

const cancelPartner = async (userId) => {
  // 사용자에게 확인 받기
  const isConfirmed = window.confirm("정말 입점취소 하시겠습니까?");
  if (isConfirmed) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/req/cancelPartner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.status === 201) {
        alert("입점취소 신청 완료");
        fetchStores(userId); // 입점 취소 후 매장 정보를 다시 불러옴
      } else {
        alert("입점취소 신청 실패");
      }
    } catch (error) {
      console.error("입점취소 신청 중 오류 발생:", error);
      alert("입점취소 신청 중 오류 발생");
    }
  } else {
    console.log("입점취소 신청이 취소되었습니다.");
  }
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
                  {store.fileList && store.fileList.length > 0 ? (
                    store.fileList.map((file, fIndex) => (
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
                    ))
                  ) : (
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707717950973-eatabel-1.png"
                      alt="Default Store Image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "40px", // 모서리를 둥글게
                      }}
                    />
                  )}
                </div>

                <p>
                  매장상태 : {store.partnerState === "TRUE" ? "OPEN" : "WITING" ? "입점 취소중" : "CLOSE" }
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
                <Button
                  className="button-link"
                  onClick={() => cancelPartner(store.userId)}
                >
                  입점취소
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
