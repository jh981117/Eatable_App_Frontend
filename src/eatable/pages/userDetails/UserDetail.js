import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DetailTab from "../userreview/DetailTab";
import { Modal } from "react-bootstrap"; // 모달을 위한 Bootstrap 컴포넌트를 사용합니다.
import Reservation from "./reservation/Reservation";
import ReservationNow from "./reservation/ReservationNow";

import { Swiper, SwiperSlide } from "swiper/react";

import { EffectCoverflow, Pagination } from "swiper";
// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const UserDetail = () => {
  let { id } = useParams();
  console.log(id); // 콘솔에 id 값이 출력되어야 합니다.
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 선택된 이미지의 인덱스를 관리하는 상태
  const [showModal, setShowModal] = useState(false); // 모달 열림 여부를 저장하는 상태 변수
  const [showModalNow, setShowModalNow] = useState(false); // 웨이팅하기 모달 열림 여부를 저장하는 상태 변수
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [detail, setDetails] = useState([]);
  const [waitingCount, setWaitingCount] = useState(0); // 웨이팅 수를 저장하는 상태 변수 추가

  const handleOpenModal = (modalType) => {
    if (modalType === "reservation") {
      setShowModal(true); // 예약하기 모달 열기 함수
    } else if (modalType === "waiting") {
      setShowModalNow(true); // 웨이팅하기 모달 열기 함수
    }
  };

  const handleCloseModal = (modalType) => {
    if (modalType === "reservation") {
      setShowModal(false); // 예약하기 모달 닫기 함수
    } else if (modalType === "waiting") {
      setShowModalNow(false); // 웨이팅하기 모달 닫기 함수
    }
  };

  useEffect(() => {

    fetch(`http://localhost:8080/api/reservation/reservationCount/${id}`) // 대기열 수를 가져오는 새로운 엔드포인트 호출
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return null;
            }
        })
        .then((data) => {
            if (data !== null) {
                setWaitingCount(data); // 가져온 웨이팅 수를 상태 변수에 저장
            }
        });
}, [id]); // 두 번째 인자로 의존성 배열을 추가하여 id가 변경될 때만 useEffect 실행



  useEffect(() => {
    fetch(`http://localhost:8080/api/partner/base/detail/${id}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log(data, "한번만제발 조회해라..");
          setDetails(data);
          setCurrentIndex(0);
        }
      });
  }, [id]); // 두 번째 인자로 의존성 배열을 추가하여 id가 변경될 때만 useEffect 실행





  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);


  console.log(waitingCount + "몇명일까요?");
  return (
    <Container>
      <Row>
        <Col>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative", // 여기에 추가
                  width: "100%",
                  height: "100%",
                  maxWidth: "700px",
                  maxHeight: "400px",
                  borderRadius: "15px",
                }}
              >
                <Swiper
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView="auto"
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={true}
                  modules={[EffectCoverflow, Pagination]}
                  onSlideChange={(swiper) =>
                    setCurrentSlideIndex(swiper.realIndex)
                  }
                  style={{ borderRadius: "15px" }}
                >
                  {detail.fileList &&
                    detail.fileList.length > 0 &&
                    detail.fileList.map((file, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={file.imageUrl}
                          alt={`Slide ${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "700px",
                            maxHeight: "400px",
                            borderRadius: "15px",
                            objectFit: "cover",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "10px",
                    backgroundColor: "rgba(240, 240, 240, 0.5)",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "30px",
                    zIndex: 1, // 여기에 추가
                  }}
                >
                  {currentSlideIndex + 1} / {detail.fileList?.length}
                </div>
              </div>
            </div>

            <Card style={{ width: "100%", maxWidth: "700px" }}>
              <Card.Title style={{ marginTop: "0px" }}></Card.Title>
              <Card.Body style={{ paddingTop: "0px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{detail.favorite}</span>
                  <span>
                    <Image
                      src="https://www.siksinhot.com/static2/images/common/bg_ico_s_click.png"
                      style={{ marginRight: "5px", marginBottom: "2px" }}
                    ></Image>
                    <span style={{ marginRight: "10px" }}>
                      {detail.viewCnt}
                    </span>
                  </span>
                </div>
                <div style={{ display: "flex" }}>
                  <h2>{detail.storeName}</h2>
                  <div style={{ marginTop: "3px" }}>
                    {" "}
                    <Image
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1707877717526-123123.png"
                      alt="Dynamic Image"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "5%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                    />
                    {detail.averageRating ? detail.averageRating : "평가중"}
                  </div>
                </div>
                {detail.address?.area ? (
                  <div>{detail.address.area}</div>
                ) : (
                  <div>주소 정보를 불러오는 중...</div>
                )}

                <div>매장번호: {detail.storePhone}</div>
                <div>테이블 수: {detail.tableCnt}</div>
                <div>주차 : {detail.parking === "FALSE" ? "불가" : "가능"}</div>
                <div>애완동물 : {detail.dog === "FALSE" ? "불가" : "가능"}</div>
              </Card.Body>
            </Card>
            <br />
            <div>
              <div>매장예약현황</div>
              <div style={{ whiteSpace: "pre-line" }}>
                {""}{" "}
                <div>
                  매장 웨이팅{" "}
                  {waitingCount > 0
                    ? `${waitingCount} 팀이 있습니다.`
                    : "없음"}
                </div>{" "}
                {""}
              </div>
            </div>

            <DetailTab id={detail.id} />
            <br />

            <div className="text-center">
              <div>
                {/* 예약하기 버튼 */}
                <Button
                  style={{
                    fontSize: "1.5rem",
                    marginTop: "0.5rem",
                    width: "25rem",
                    float: "left",
                  }}
                  onClick={() => handleOpenModal("reservation")}
                >
                  예약하기
                </Button>
              </div>

              <div>
                {/* 웨이팅하기 버튼 */}
                <Button
                  style={{
                    fontSize: "1.5rem",
                    marginTop: "0.5rem",
                    width: "25rem",
                    float: "right",
                  }}
                  onClick={() => handleOpenModal("waiting")}
                >
                  웨이팅하기
                </Button>
              </div>
            </div>

            {/* 모달 컴포넌트 */}
            <Modal
              show={showModal}
              onHide={() => handleCloseModal("reservation")}
            >
              <Modal.Header closeButton>
                <Modal.Title>예약하기</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Reservation 컴포넌트를 여기에 표시 */}
                <Reservation />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleCloseModal}>닫기</Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showModalNow}
              onHide={() => handleCloseModal("waiting")}
            >
              <Modal.Header closeButton>
                <Modal.Title>예약하기</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Reservation 컴포넌트를 여기에 표시 */}
                <ReservationNow />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleCloseModal}>닫기</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetail;
