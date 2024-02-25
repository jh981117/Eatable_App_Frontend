import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Button, Card, Form } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';


const ReviewPage = () => {

  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [editReview, setEditReview] = useState(null);  // 리뷰수정상태인지 아닌지 수정중:리뷰객체담음, 수정X : null
  const [editContent, setEditContent] = useState(""); // 내용수정

  useEffect(() => {
   
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    const decoded = jwtDecode(token); // 토큰 디코딩
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

  if (loading) { return <div>로딩중...</div> }
  if (error) { return <div>에러 : {error}</div> }
  const updateReview = (review) => {
    setEditReview(review);
    setEditContent(review.content);
  }
  
  // 리뷰 수정
  const handleUpdate =  (review) => {
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
      alert("리뷰글이 수정되었습니다.");
      setReviews(updatedReviews);
      // 이미지 수정
      setEditReview(null); // 수정완료후 editReview를 null로 설정 편집모드종료
  })
  .catch((error) => {
    setError(error.message);
  });
};
// 리뷰삭제
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
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if(confirm) {
      if (response.status === 200) {
        setReviews(updatedReviews);
        navigate("/usermypage");
      } else if (response.status !== 200) {
          navigate(-1);
      }
    }
  })
  .catch((error) => {
    setError(error.message);
  });
};

const cancelUpdate = () => {
  setEditReview(null); // 수정 취소 시 수정 중인 리뷰 상태 초기화
};
console.log(reviews, "re");


  return (
    <div>
      <h5>나의 리뷰 목록</h5>
      {reviews.map((review) => (
      <Card key={review.id}>
        <Card.Body>
          <div style={{display: "flex", justifyContent: "space-between", marginTop: "-5px"}}>
              {/* <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px"}}> */}
                <small >id : {review.id}</small>
              {/* </div> */}
                <button onClick={() => updateReview(review)} style={{ backgroundColor: "white", marginTop: "-10px", marginRight: "-15px", display: "flex", justifyContent: "center" }}><img src='https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708585046303-free-icon-commenting-8103745.png' style={{width: "20px"}}/></button>
          </div>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <span>{review.partner.storeName}</span>
            <span style={{textAlign: "right", flex: 1}}>{review.createdAt}</span><br/>
          </div>
          <small>평점 : {review.avg}</small><br/><br/>
          <span>{review.partnerReviewAttachments.map((url, index) => (<img key={index} src={url.imageUrl} alt={`Review Attachment ${index + 1}`} style={{ borderRadius: "15px", width: "80px" }}/>))}</span><br/>

          {editReview === review ? (
              <>
                <Form.Control as="textarea" rows={3} value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
                <Button onClick={() => deleteReview(review)}>삭제</Button>
                <Button onClick={cancelUpdate}>취소</Button> {/* 수정 취소 버튼 */}
                <Button onClick={() => handleUpdate(review)}>완료</Button>
              </>
            ) : (
              <span>{review.content}</span>
            )}<br/>
            
          {/* <span>{"댓글"}</span><hr/>
          <span>{"댓글목록"}</span> */}

        </Card.Body>

      </Card>
      ))}
    </div>
  );
};

export default ReviewPage;