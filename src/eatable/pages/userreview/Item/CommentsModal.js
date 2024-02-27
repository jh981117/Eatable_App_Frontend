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
  onUpdateComment,
  onDeleteComment,
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
      const response = await fetch(
        `http://localhost:8080/api/comments/${editingCommentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editingText }),
        }
      );
      const updatedComment = await response.json(); // 가정: API 응답으로 수정된 댓글 객체를 받는다
      if (response.ok) {
        onUpdateComment(updatedComment); // 수정된 댓글로 상태 업데이트
        setEditMode(false);
        setEditingCommentId(null);
      } else {
        throw new Error("댓글 수정 실패");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };
  const handleDelete = async (commentId) => {
    const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          onDeleteComment(commentId); // 삭제 성공 시 상위 컴포넌트의 상태 업데이트
        } else {
          throw new Error("댓글 삭제 실패");
        }
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
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
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708996796256-free-icon-comment-alt-edit-12356167.png"
                      variant="outline-secondary"
                      style={{ width: "30px", cursor: "pointer" }}
                      onClick={() => handleEdit(comment)}
                    />
                    {/* 수정 */}
                    <img
                      src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708996945711-free-icon-close-6276642.png"
                      style={{ width: "30px", cursor: "pointer" }}
                      onClick={() => handleDelete(comment.id)}
                    />
                    {/* 삭제 */}
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
          <Modal.Footer>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              작성
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              닫기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CommentsModal;
