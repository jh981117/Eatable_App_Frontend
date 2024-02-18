import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EatableTimeLine from '../userreview/EatableTimeLine';
import { Image, Modal } from 'react-bootstrap';
import GoogleMaps from '../partner/GoogleMaps';
import Roulette from '../partner/Roulette';

const TopCategoty = () => {

      const [showMap, setShowMap] = useState(false);
      const [showRoulette, setShowRoulette] = useState(false);


      const handleCloseMap = () => setShowMap(false);
      const handleShowMap = () => setShowMap(true);

      const handleCloseRoulette = () => setShowRoulette(false);
      const handleShowRoulette = () => setShowRoulette(true);
    return (
      <div>
        <Image
          src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708051385932-map.png"
          onClick={handleShowMap}
          style={{ width: "50px" }}
        />
        맛집지도
        <Image
          src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708051794890-fortune.png"
          onClick={handleShowRoulette}
          style={{ width: "50px" }}
        />
        룰렛추천
        <Link to={"/eatabletimeline"} style={{ textDecoration: "none", color: "black" }}>
          <Image
            src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708178363571-time.png"
            style={{ width: "50px" }}
          />
          타임라인
        </Link>
        {/* GoogleMap 모달 */}
        <Modal show={showMap} onHide={handleCloseMap} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>맛집지도</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100%" }}
            >
              <div style={{ maxWidth: "600px", width: "100%" }}>
                {" "}
                {/* 가로 크기 조정이 필요할 경우 */}
                <GoogleMaps />
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* Roulette 모달 */}
        <Modal show={showRoulette} onHide={handleCloseRoulette} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>룰렛추천</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100%" }}
            >
              <div style={{ maxWidth: "600px", width: "100%" }}>
                {" "}
                {/* 가로 크기 조정이 필요할 경우 */}
                <Roulette />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
};

export default TopCategoty;