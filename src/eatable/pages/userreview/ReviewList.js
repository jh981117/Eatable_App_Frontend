import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";



const ReviewList = () => {

     const ButtonStyle = {
       fontSize: "14px", // 원하는 글자 크기로 조정
       margin: "0", // 마진 없애기
       marginRight: "5px",
     };


  return (
    <div>
      <Link to={"/detailtab"}>
        <Button variant="outline-secondary" style={ButtonStyle}>
          디테일탭
        </Button>
      </Link>
      <Link to={"/reviewimg"}>
        <Button variant="outline-secondary" style={ButtonStyle}>
          디테일리뷰이미지만
        </Button>
      </Link>
      <Link to={"/reviewdetail"}>
        <Button variant="outline-secondary" style={ButtonStyle}>
          디테일리뷰
        </Button>
      </Link>
      <Link to={"/eatabletimeline"}>
        <Button variant="outline-secondary" style={ButtonStyle}>
          타임라인
        </Button>
      </Link>

      <Link to={"/reviewwrite"}>
        <Button variant="outline-secondary" style={ButtonStyle}>
          리뷰작성
        </Button>
      </Link>
    </div>
  );
};

export default ReviewList;
