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
import { Col, Container, Row, Table } from 'react-bootstrap';

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

const BarChartNewp = () => {
  const [userLists, setUserLists] = useState([]);
  const [selectDate, setSelectDate] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/list")
      .then(response => response.json())
      .then(data => {
        // ROLE_ADMIN을 가진 사용자 필터링
        const authfilter = data.filter(user => !user.roles.map(role => role.roleName).includes("ROLE_ADMIN"));
        setUserLists(authfilter);
      })
      .catch(error => {
        console.error("Error fetching user list:", error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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

  const userListsByDate = {}; // 각 날짜별 가입자 수를 저장할 객체

  userLists.forEach(user => {
    const createdAt = new Date(user.createdAt); // 사용자의 가입일
    const dateString = createdAt.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }); // 가입일을 문자열로 변환하여 해당하는 날짜 텍스트 생성
    userListsByDate[dateString] = (userListsByDate[dateString] || 0) + 1; // 해당 날짜의 가입자 수를 증가시킴
  });

  const data = {
    labels,
    datasets: [
      {
        label: '일일신규가입자수',
        data: labels.map(date => userListsByDate[date] || 0), // 각 날짜별 가입자 수를 매핑
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
    <Container fluid>
      <Row>
        <Col>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Bar options={{ ...options, onClick: BarClick }} data={data} width={600} height={300} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <CSSTransition
            in={!!selectDate}
            timeout={300}
            classNames="table"
            unmountOnExit
          >
            <AnimatedTable show={!!selectDate} striped bordered hover size="sm" className="list_table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>가입아이디</th>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>이메일</th>
                  <th>신청날짜</th>
                </tr>
              </thead>
              <tbody>
                {userLists
                  .filter(user => new Date(user.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) === selectDate)
                  .map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))}
              </tbody>
            </AnimatedTable>
          </CSSTransition>
        </Col>
      </Row>
    </Container>
  );
};

export default BarChartNewp;
