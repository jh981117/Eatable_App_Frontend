import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CommentsModal = ({ show, handleClose, reviewId, comments, onSubmit }) => {
  const [commentText, setCommentText] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reviewId,
      text: commentText,
    });
    setCommentText(""); // 입력 필드 초기화
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>댓글</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {comments.map((comment, index) => (
          <div key={index}>
            <strong>{comment.author}</strong>: {comment.text}
          </div>
        ))}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="댓글 추가..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            제출
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CommentsModal;
