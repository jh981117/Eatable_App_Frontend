import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 링크가 이게 맞나???????
    const API_ENDPOINT = 'https://localhost:8080/api/user/reviews';

    // 사용자의 리뷰 목록 가져오기
    axios.get(API_ENDPOINT)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  return (
    <div>
      <h5>나의 리뷰 목록</h5>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <strong>{review.title}</strong>
            <p>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewPage;