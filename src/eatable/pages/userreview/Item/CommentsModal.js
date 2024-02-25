import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CommentForm from "./CommentForm"; // 이미 만들어진 CommentForm 컴포넌트 경로를 맞춰주세요.

const CommentsModal = ({ show, handleClose, reviewId, comments }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>댓글</Modal.Title>
      </Modal.Header>
  <Modal.Body>
  {comments.map((comment, index) => (
    <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
      <strong style={{ marginRight: '10px' }}>{comment.author}</strong>
      <span>{comment.content}</span>
    </div>
  ))}
</Modal.Body>

      <Modal.Footer>
        <CommentForm reviewId={reviewId} onSubmit={onsubmit} />
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;
