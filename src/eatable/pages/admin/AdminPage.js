import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col,Button, Form, Modal, Table, Tab,Tabs } from 'react-bootstrap';

import LineChart from './LineChart';
import BarChart from './BarChart';
import ApplyList from './ApplyList';
import CancelList from './CancelList';

const AdminPage = () => {  
    return (
        <div>
           <Tabs defaultActiveKey="apply">
            <Tab eventKey="apply" title="입점신청List">
              <h3>입점신청List</h3>
                <ApplyList/>
            </Tab>

            <Tab eventKey="cancel" title="입점취소List">
              <h3>입점취소List</h3>
                 <CancelList/>
            </Tab>

            <Tab eventKey="newp" title="신규가입자수">
              <h3>신규가입자수</h3>
              <Container>
                <Row >        
                  <Col className="d-flex justify-content-center"><BarChart /></Col>
                </Row>        
              </Container>
                    
            </Tab>

            <Tab eventKey="news" title="신규가게수">
              <h3>신규가게수</h3>
              <Container>
                <Row >        
                  <Col className="d-flex justify-content-center"><BarChart /></Col>
                </Row>        
              </Container>
            </Tab>
            <Tab eventKey="totalp" title="총가입자수">
              <h3>총가입자수</h3>
              <Container>       
                <Row >
                  <Col className="d-flex justify-content-center mb-4" ><LineChart /></Col>
                </Row>
              </Container>  
            </Tab>
          </Tabs>    
          <Button variant="outline-primary me-2" >
                  입점신청폼1
          </Button>
          <Button variant="outline-primary" >
                  입점신청폼2
          </Button>
        </div>
    );
};

export default AdminPage;