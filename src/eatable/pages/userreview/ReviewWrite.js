import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import ReviewList from "./ReviewList";
import { Container, Form, Button, Modal } from "react-bootstrap";
import StarAvg from "./Item/StarAvg";
import { useDropzone } from "react-dropzone";

const ReviewWrite = ({ partnerId = 1 }) => {
  const [reviewWrite, setReviewWrite] = useState({
    userId: "",
    nickName: "",
    partnerId: 1,
    content: "",
    avg: "",
    imgList: [],
  });

  console.log(reviewWrite);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalContent, setModalContent] = useState(""); // 모달 내용

  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      const decodedToken = jwtDecode(token);
      setReviewWrite((prevState) => ({
        ...prevState,
        userId: decodedToken.userId,
        nickName: decodedToken.nickName,
        partnerId: 1,
        name: decodedToken.name,
      }));
    }
  }, [partnerId]);

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewWrite((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  ////////////////이미지
  // 이미지 드롭 핸들러
  const onDrop = useCallback((acceptedFiles) => {
    const mappedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setReviewWrite((prevState) => ({
      ...prevState,
      imgList: [...prevState.imgList, ...mappedFiles],
    }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  // 폼 제출 핸들러

  // 언마운트 시 URL 오브젝트 클린업
  useEffect(() => {
    return () =>
      reviewWrite.imgList.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [reviewWrite.imgList]);

  // 이미지 제거 핸들러
  const removeImage = (index) => {
    setReviewWrite((prevState) => ({
      ...prevState,
      imgList: prevState.imgList.filter((_, i) => i !== index),
    }));
  };

  // 컴포넌트 언마운트 시 URL 오브젝트 클린업
  useEffect(() => {
    return () =>
      reviewWrite.imgList.forEach((image) =>
        URL.revokeObjectURL(image.preview)
      );
  }, [reviewWrite.imgList]);

  // 리뷰 데이터 제출 핸들러
  // 리뷰 데이터와 이미지 파일을 함께 제출하는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력 검사
    if (!reviewWrite.content.trim() || reviewWrite.imgList.length === 0) {
      // 오류 메시지 설정 및 모달 열기
      setModalContent("이미지와 리뷰 내용은 필수 입력 사항입니다.");
      setIsModalOpen(true);
      return; // 추가 처리 중단
    }

    // 리뷰 텍스트 데이터 객체 생성
    const reviewData = {
      userId: reviewWrite.userId,
      partnerId: reviewWrite.partnerId,
      content: reviewWrite.content,
      avg: reviewWrite.avg,
    };

    try {
      // 첫 번째 요청: 리뷰 텍스트 데이터 전송
      const reviewResponse = await fetch(
        "http://localhost:8080/api/store/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (reviewResponse.ok) {
        const reviewResult = await reviewResponse.json();
        console.log(reviewResult.message); // "리뷰가 성공적으로 등록되었습니다."

        // 두 번째 요청: 이미지 파일 전송
        await uploadReviewImages(reviewResult.reviewId);
      } else {
        throw new Error("리뷰 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const uploadReviewImages = async (reviewId) => {
    const formData = new FormData();
    reviewWrite.imgList.forEach((file) => {
      formData.append("files", file); // 이미지 파일 추가
    });

    try {
      // 이미지 파일 전송
      const imageResponse = await fetch(
        `http://localhost:8080/api/store/reviews/${reviewId}/attachments`,
        {
          method: "POST",
          body: formData, // Content-Type을 설정하지 않음. 브라우저가 자동으로 처리
        }
      );

      if (imageResponse.ok) {
        setModalContent("리뷰 등록이 완료되었습니다.");
        setIsModalOpen(true);
        console.log("이미지 파일 업로드 성공");
      } else {
        setModalContent("리뷰 등록에 실패했습니다.");
        setIsModalOpen(true);
        throw new Error("이미지 파일 업로드 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  ///////저장 ///////
  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 모든 요소를 가운데 정렬하기 위해 alignItems 사용

          minHeight: "100vh", // 전체 화면 높이
        }}
      >
        <style>
          {`
      @keyframes cloudBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      .cloudBounce:hover {
        animation: cloudBounce 1s infinite ease-in-out;
      }
    `}
        </style>
        <ReviewList />
        <div
          style={{
            maxWidth: "700px", // 최대 가로 너비 설정
            width: "100%", // 너비를 100%로 설정하여 부모 컨테이너에 맞춤
            display: "flex",
            flexDirection: "column",
            padding: "20px", // 패딩으로 내부 여백 생성
            boxSizing: "border-box", // 패딩과 보더가 너비에 포함되도록 설정
          }}
        >
          <h4>Eatable {reviewWrite.nickName}님의 리뷰 작성</h4>
          <Form onSubmit={handleSubmit}>
            {" "}
            <div style={{ maxWidth: "700px" }}>
              Eatable {reviewWrite.nickName}님의 리뷰 작성
            </div>
            <Form.Group>
              <Form.Label>
                <small style={{ fontSize: "15px" }}>를 추천 해주세요</small>
              </Form.Label>
              <StarAvg
                rating={reviewWrite.avg}
                setRating={(rating) =>
                  setReviewWrite({ ...reviewWrite, avg: rating })
                }
              />
              <div style={{ fontSize: "13px" }}>
                별을 클릭해서 평가해주세요.
              </div>
            </Form.Group>
            {/* ///이미지/// */}
            <div
              style={{
                border: "0.1px solid white",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <div
                {...getRootProps()}
                style={{
                  display: "flex",
                  flexDirection: "column", // 요소들을 세로 방향으로 정렬
                  justifyContent: "center", // 가로축 중앙 정렬
                  alignItems: "center", // 세로축 중앙 정렬
                  padding: "0px",
                  cursor: "pointer",
                  textAlign: "center",
                  width: "100%",
                  height: "100px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column", // 요소들을 세로 방향으로 정렬
                    justifyContent: "center", // 가로축 중앙 정렬
                    alignItems: "center", // 세로축 중앙 정렬
                    padding: "0px",
                    cursor: "pointer",
                    textAlign: "center",
                    width: "100%",
                    height: "100px",
                  }}
                >
                  <input {...getInputProps()} />
                  <img
                    src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708187617860-free-icon-camera-685655.png"
                    alt="Camera Icon"
                    className="cloudBounce" // 바운스 애니메이션 클래스 적용
                    style={{
                      width: "50px",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                  />
                  <small
                    style={{
                      opacity: 0.5,
                      fontSize: "13px",
                      marginTop: "10px",
                    }}
                  >
                    카메라를 클릭하면 이미지를 등록할 수 있어요.
                  </small>
                </div>
              </div>

              <div style={{ width: "100%" }}>
                {" "}
                {/* 최상위 div 너비를 100%로 설정 */}
                <div
                  style={{
                    display: "flex",
                    marginTop: "20px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%", // 부모 컨테이너의 너비를 100%로 설정
                  }}
                >
                  {reviewWrite.imgList.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        margin: "10px",
                        width: "100px", // 이미지 컨테이너의 너비 설정
                        maxWidth: "100%", // 최대 너비를 100%로 설정하여 화면 너비에 맞춤
                      }}
                    >
                      <img
                        src={image.preview}
                        style={{
                          width: "100%", // 이미지 너비를 컨테이너의 100%로 설정
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        alt="preview"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          opacity: 0.5,
                          padding: 0,
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          margin: 0,
                          background: "white",
                          color: "black",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* /////// */}
            <Form.Group>
              <Form.Label>리뷰 내용</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                placeholder="매장에 대한 리뷰를 작성해보세요(필수)"
                value={reviewWrite.content}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              완료
            </Button>
          </Form>
          <Modal show={isModalOpen} onHide={closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>알림</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalContent}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                닫기
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </Container>
  );
};

export default ReviewWrite;
