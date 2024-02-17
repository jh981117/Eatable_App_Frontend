import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import ReviewList from "./ReviewList";
import { Container, Form, Button } from "react-bootstrap";
import StarAvg from "./Item/StarAvg"

const ReviewWrite = ({ partnerId }) => {
  const [reviewWrite, setReviewWrite] = useState({
    userId: "",
    nickName: "",
    partnerId: partnerId,
    content: "",
    avg: "",
    imgList: [],
  });

  console.log(reviewWrite)

  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      const decodedToken = jwtDecode(token);
      setReviewWrite((prevState) => ({
        ...prevState,
        userId: decodedToken.userId,
        nickName: decodedToken.nickName,
        partnerId: partnerId,
        name: decodedToken.name
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

  // 리뷰 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(reviewWrite);
    // 서버로 리뷰 데이터 전송 로직 구현
  };

  return (
    <div>
      <ReviewList />
      <Container>
        {reviewWrite.nickName}님 리뷰를 작성해주세요.
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>매장</Form.Label>
            <Form.Control
              name="partnerId"
              value={reviewWrite.partnerId}
              onChange={handleInputChange}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>작성자</Form.Label>
            <Form.Control
              name="nickName"
              value={reviewWrite.nickName}
              onChange={handleInputChange}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>리뷰 내용</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={reviewWrite.content}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>평점</Form.Label>
            <StarAvg
              rating={reviewWrite.avg}
              setRating={(rating) =>
                setReviewWrite({ ...reviewWrite, avg: rating })
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            완료
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ReviewWrite;
