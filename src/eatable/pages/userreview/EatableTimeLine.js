import React from 'react';
import { Container } from 'react-bootstrap';
import ReviewList from './ReviewList';

const EatableTimeLine = () => {
    return (
      <div>
        <ReviewList />
        <Container>타임라인</Container>
      </div>
    );
};

export default EatableTimeLine;