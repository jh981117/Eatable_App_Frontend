import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';

const DetailHome = ({id}) => {
 const [detail, setDetails] = useState([]);
    useEffect(() => {
      const token = localStorage.getItem("token")
      fetch(`http://localhost:8080/api/partner/base/detail/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return null;
          }
        })
        .then((data) => {
          if (data !== null) {
            console.log(data, "한번만제발 조회해라..");
            setDetails(data);
          }
        });
    }, [id]); 

    return (
      <>
            <small
              style={{
                marginTop: "5px",
                marginLeft: "5px",
                // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              매장소개
            </small>
        <Card style={{ width: "100%", maxWidth: "700px" , boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",}}>
          <Card.Title>
          </Card.Title>
          <Card.Body>
            <div>{detail.storeInfo}</div>
          </Card.Body>
        </Card>
            <small style={{ marginTop: "5px", marginLeft: "5px" }}>
              오픈시간
            </small>
        <Card
          style={{
            width: "100%",
            maxWidth: "700px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Card.Title>
          </Card.Title>
            <Card.Body>
              <div>{detail.openTime}</div>
            </Card.Body>
        </Card>
            <small style={{ marginTop: "5px", marginLeft: "5px" }}>
              예약정보
            </small>
        <Card
          style={{
            width: "100%",
            maxWidth: "700px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Card.Title>
          </Card.Title>
          <Card.Body>
            <div>{detail.reserveInfo}</div>
          </Card.Body>
        </Card>
      </>
    );
};

export default DetailHome;