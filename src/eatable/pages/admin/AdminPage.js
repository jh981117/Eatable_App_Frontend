import React, { useRef, useState } from 'react';
import './AdminCSS.css'
import { Route, Routes } from 'react-router-dom';
import { Container, Row, Col} from 'react-bootstrap';
import BarChart from './BarChart';
import ApplyList from './ApplyList';
import LineChart from './LineChart';
const AdminPage = () => {
  
    return (
    <>     
      <Container>
        <Row >
          <Col className="d-flex justify-content-center"><BarChart /></Col>
          <Col className="d-flex justify-content-center"><BarChart /></Col>
        </Row>
        <Row >
          <Col className="d-flex justify-content-center mb-4" ><LineChart /></Col>
        </Row>
      </Container>
      <ApplyList/>   
      </>
    );
  };

export default AdminPage;