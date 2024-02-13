import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {Col, Container, Row, Table } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const AnimatedTable = styled(Table)`
  opacity: 0;
  animation: ${({ show }) => (show ? fadeIn : fadeOut)} 0.3s ease-in-out forwards;
`;

   const BarChartNews = () => {
    const [storeLists, setStoreLists] = useState([]);
    const [selectDate, setSelectDate] = useState(null);

    useEffect(()=>{

      fetch("http://localhost:8080/api/partner/totallist")

          .then(response => response.json())
          .then(data => {
            setStoreLists(data);    
          });
         },[])
  console.log("1",storeLists)
  
    const options = {
      responsive: false,
      plugins: {
        legend: {
          position: 'top' ,
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart',
        },
      },
    };

    const getWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)    
      const mondayDate = new Date(today); // 오늘의 날짜를 복사하여 시작 날짜로 설정
      mondayDate.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // 이번 주 월요일로 설정
    
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(mondayDate);
        date.setDate(mondayDate.getDate() + i);
        weekDates.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));
      }
      return weekDates;
    };
    
    const labels = getWeekDates();



  
  const storeListsByDate = {}; // 각 날짜별 가입자 수를 저장할 객체

  storeLists.forEach(store => {
    const createdAt = new Date(store.createdAt); // 사용자의 가입일

    const dateString = createdAt.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }); // 가입일을 문자열로 변환하여 해당하는 날짜 텍스트 생성
   

    storeListsByDate[dateString] = (storeListsByDate[dateString] || 0) + 1; // 해당 날짜의 가입자 수를 증가시킴
  });

  const data = {
    labels,
    datasets: [
      {
        label: '일일신규가게수',
        data: labels.map(date => storeListsByDate[date] || 0), // 각 날짜별 가입자 수를 매핑
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      } 
    ],
  };

   const BarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedDate = labels[elements[0].index];
      setSelectDate(date => (date === clickedDate ? null : clickedDate));
    }
  };

  return (
    <div>
    <Bar options={{ ...options, onClick: BarClick }} data={data} height="600px" width="1000px" />
    <CSSTransition
      in={!!selectDate}
      timeout={300}
      classNames="table"
      unmountOnExit
    >
      <Container>     
        <Row>
          <Col>
            <AnimatedTable show={!!selectDate} striped bordered hover size="sm" className="list_table">
              <thead>
                <tr>
                  <th>id</th>                  
                  <th>매장이름</th>
                  <th>매장주소</th>
                  <th>관리자이름</th>
                  <th>관리자연락처</th>
                  <th>매장연락처</th>
                  <th>업종</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {storeLists
                  .filter(store => new Date(store.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) === selectDate)
                  .map(store => (
                    <tr key={store.id}>
                      <td>{store.id}</td>
                      <td>{store.storeName}</td>
                      <td>{store.area}</td>
                      <td>{store.partnerName}</td>
                      <td>{store.partnerPhone}</td>
                      <td>{store.storePhone}</td>
                      <td>{store.storeInfo}</td>                    
                      <td>{new Date(store.createdAt).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))}
              </tbody>
            </AnimatedTable>
          </Col>
        </Row>
      </Container>
    </CSSTransition>
  </div>
  );
  }

  export default BarChartNews;