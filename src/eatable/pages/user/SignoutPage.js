import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';

const SignoutPage = () => {
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const handleSignout = () => {
    // 실제 회원 탈퇴 로직 추가
    // 여기에서 실제 비밀번호 확인 로직을 수행하고, 결과에 따라 showModal 및 isPasswordCorrect 상태 업데이트
    const isCorrect = true; // 실제 비밀번호 확인 로직을 추가해야 합니다.
    
    setIsPasswordCorrect(isCorrect);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsPasswordCorrect(false); // 팝업이 닫힐 때 상태 초기화
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Form>
            <Form.Group controlId="formPassword">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="danger" type="button" onClick={handleSignout} disabled={!password}>
              회원 탈퇴
            </Button>
          </Form>
        </Col>
      </Row>

      {/* 비밀번호 확인 결과에 따른 팝업 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPasswordCorrect ? '정말 탈퇴하시겠습니까?' : '비밀번호가 틀렸습니다. 다시 확인해주세요.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
          {isPasswordCorrect && (
            <Button variant="danger" onClick={handleCloseModal}>
              탈퇴하기
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SignoutPage;