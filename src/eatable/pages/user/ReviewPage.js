import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';


const ReviewPage = () => {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [editReview, setEditReview] = useState(false);
  const [editContent, setEditContent] = useState("");

  
  useEffect(() => {
   
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    const decoded = jwtDecode(token); // 토큰 디코딩
    console.log(decoded)

    setLoading(true);
    setError();
    
    fetch(`http://localhost:8080/api/store/user/${decoded.userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("리뷰 가져오기 실패")
      }
      return response.json()
    })
    .then((data) => {
      setReviews(data);
      setLoading(false); // 데이터가 가져 와지면 로딩 상태 설정 해제
    })
  }, []);

  if (loading) {
    return <div>로딩중...</div>
  }
  if (error) {
    return <div>에러 : {error}</div>
  }
  
  const updateReview = (review) => {
    setEditReview(review);
    setEditContent(review.content);
  }
  
  const handleUpdate =  (review) => {
    
    // 서버로 수정된 리뷰 보내야됨
     fetch(`http://localhost:8080/api/store/reviews/update`, {
    method: "PUT",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({
      storeReviewId: review.id, // 수정된 리뷰의 ID도 전달
      content: editContent,
      avg: review.avg,
    }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("리뷰 수정 실패");
    }
    // 화면에 수정된 리뷰 반영
    const updatedReviews = reviews.map((r) =>
      r.id === review.id ? { ...r, content: editContent } : r
    );
    setReviews(updatedReviews);
    setEditReview(false);
  })
  .catch((error) => {
    setError(error.message);
  });
};

  const deleteReview = (review) => {

    fetch(`http://localhost:8080/api/store/reviews/delete/${review.id}`, {
    method: "DELETE",
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("리뷰 삭제 실패");
    }
    // 삭제된 리뷰를 화면에서도 제거
    const updatedReviews = reviews.filter((r) => r.id !== review.id);
    setReviews(updatedReviews);
  })
  .catch((error) => {
    setError(error.message);
  });
};
  
console.log(reviews, "re");

  return (
    <div>
      <h5>나의 리뷰 목록</h5>
      {reviews.map((review) => (
      <Card key={review.id}>
        <Card.Body>
          <span>{review.partner.storeName}</span><br/>
          <div style={{display: "flex", justifyContent: "space-between"}}>
          <span>평점 : {review.avg}</span>
          <span style={{textAlign: "right", flex: 1}}>{review.createdAt}</span><br/></div>
          <span>{review.partnerReviewAttachments.map((url, index) => (<img key={index} src={url.imageUrl} alt={`Review Attachment ${index + 1}`} style={{ borderRadius: "15px", width: "80px" }}/>))}</span><br/>
          {editReview === review ? (<Form.Control as="textarea" rows={3} value={editContent} onChange={(e) => setEditContent(e.target.value)}/>) : (<span>{review.content}</span>)}
          {editReview === review ? (<Button onClick={() => handleUpdate(review)}>완료</Button>) : (<Button onClick={() => updateReview(review)}>수정</Button>)}
          <Button onClick={() => deleteReview(review)}>삭제</Button><br/>
          <span>{"댓글"} {"❤️ 13"}</span><br/>
          <span>{"댓글목록"}</span>

        </Card.Body>

      </Card>
      ))}
    </div>
  );
};

export default ReviewPage;