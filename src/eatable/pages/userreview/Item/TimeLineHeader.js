import React from "react";
import { Container } from "react-bootstrap";

const TimeLineHeader = () => {
  return (
    <Container>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <img src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708150496729-logo.png" />
        <span style={{ fontSize: "20px", marginTop: "10px" }}> Timeline</span>
      </div>
    </Container>
  );
};

export default TimeLineHeader;
