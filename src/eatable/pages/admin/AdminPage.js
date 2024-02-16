import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col,Button, Form, Modal, Table, Tab,Tabs } from 'react-bootstrap';

import LineChart from './LineChart';
import BarChartNewp from './BarChartNewp';
import ApplyList from './ApplyList';
import CancelList from './CancelList';
import BarChartNews from './BarChartNews';
import History from './History';

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
                  <Col className="d-flex justify-content-center"><BarChartNewp /></Col>
                </Row>        
              </Container>                    
            </Tab>

            <Tab eventKey="news" title="신규가게수">
              <h3>신규가게수</h3>
              <Container>
                <Row >        
                  <Col className="d-flex justify-content-center"><BarChartNews /></Col>
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
            <Tab eventKey="history" title="히스토리">
              <h3>히스토리</h3>
              <Container>       
                <Row >
                  <Col className="d-flex justify-content-center mb-4" ><History /></Col>
                </Row>
              </Container>  
            </Tab>
          </Tabs>           
       </div>
    );
};

export default AdminPage;