import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from "styled-components";

const StyleDate = styled(DatePicker)`
 @media screen and (max-width: 600px) {
    width: 60px;
 }
`

const StyledTable = styled(Table)`

 width: 1270px;

@media screen and (max-width: 600px) {
  th,
    td {
      font-size: 0.5rem; 
    }
    width: 500px;
}
`

const History = () => {
    const [historyLists, setHistoryLists] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/userhistory/totallist`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setHistoryLists(data);
            })
            .catch((error) => {
                console.error(error);
                // 오류 처리를 위한 작업 추가
            });
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredLists = selectedDate
    ? historyLists
          .filter((historyList) => new Date(historyList.createdAt).toLocaleDateString() === selectedDate.toLocaleDateString())
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : historyLists;
    
    return (
        <Container>
            <Row>
                <Col>
                    <StyleDate
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="날짜 선택"
                        className="form-control"
                    />
                </Col>
            </Row>
            <StyledTable striped bordered hover size="sm" className="list_table" >
                <thead>
                    <tr>
                        <th>히스토리</th>
                        <th>발생시간</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLists.map((historyList, index) => (
                        <tr key={index}>
                            <td>{historyList.name}</td>
                            <td>{new Date(historyList.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </Container>
    );
};

export default History;
