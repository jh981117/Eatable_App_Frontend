import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";


  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.userId; // 토큰에 저장된 사용자 ID 필드명에 따라 조정 필요
  };


const CommentsModal = ({
  show,
  handleClose,
  reviewId,
  comments,
  onSubmit,
  fetchComments,
}) => {
  const [commentText, setCommentText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const currentUserId = getCurrentUserId(); // 현재 로그인한 사용자의 ID 가져오기

  const handleEdit = (comment) => {
    setEditMode(true);
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };


  const handleEditSubmit = async (commentId) => {
    try {
      // API 호출을 통해 서버에 댓글 수정 요청
      await fetch(`http://localhost:8080/api/comments/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingText }),
      });
      // 성공적으로 수정된 경우, UI 업데이트 로직
      setEditMode(false);
      setEditingCommentId(null);
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };
const handleDelete = async (commentId) => {
  const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
  if (isConfirmed) {
    const newComments = comments.filter((comment) => comment.id !== commentId);
    // 미리 UI 업데이트
    try {
      // 서버에 댓글 삭제 요청
      const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
        // 실패 시 롤백
      }
      // 성공적으로 삭제되면, 이미 UI는 업데이트된 상태임
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      // 실패 시 UI 롤백 또는 사용자에게 알림
      fetchComments();
    }
  }
};




  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reviewId, text: commentText });
    setCommentText(""); // 입력 필드 초기화
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>댓글</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={comment.user.profileImageUrl}
                alt="Profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <strong>{comment.user.nickName}</strong>
            </div>
            {editMode && editingCommentId === comment.id ? (
              <div style={{ marginTop: "10px" }}>
                <Form.Control
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleEditSubmit(comment)}
                  style={{ marginRight: "10px" }}
                >
                  수정 완료
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(false)}
                >
                  취소
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: "10px" }}>
                <span>{comment.content}</span>
                {currentUserId === comment.user.id && (
                  <>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleEdit(comment)}
                    >
                      수정
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </div>
            )}
            <hr />
          </div>
        ))}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="댓글 추가..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ marginBottom: "10px" }}
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
