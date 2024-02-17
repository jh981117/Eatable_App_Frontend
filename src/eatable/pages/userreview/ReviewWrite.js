import React, { useState } from 'react';
import ReviewList from './ReviewList';
import { Container } from 'react-bootstrap';

const ReviewWrite = () => {


  const [reviewWrite , setReviewWrite] = useState({
    userId: "",
    partnerId: "",
    content: "",
    avg: "",


  })
    return (
      <div>
        <ReviewList />
        <Container>1234</Container>
      </div>
    );
};

export default ReviewWrite;