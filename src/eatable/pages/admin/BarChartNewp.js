import React, { useEffect, useState } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

   const BarChartNewp = () => {
    const [userLists, setUserLists] = useState([]);

    useEffect(()=>{
      fetch("http://localhost:8080/api/user/list")
          .then(response => response.json())
          .then(data => {
            setUserLists(data);    
          });
  },[])
  
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



  
  const userListsByDate = {}; // 각 날짜별 가입자 수를 저장할 객체

  userLists.forEach(user => {
    const regDate = new Date(user.regDate); // 사용자의 가입일
    const dateString = regDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }); // 가입일을 문자열로 변환하여 해당하는 날짜 텍스트 생성
    userListsByDate[dateString] = (userListsByDate[dateString] || 0) + 1; // 해당 날짜의 가입자 수를 증가시킴
  });

  const data = {
    labels,
    datasets: [
      {
        label: '일일신규가게수',
        data: labels.map(date => userListsByDate[date] || 0), // 각 날짜별 가입자 수를 매핑
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      } 
    ],
  };

    return <Bar options={options} data={data} height="600px" width="1000px"/>;

  }

  export default BarChartNewp;