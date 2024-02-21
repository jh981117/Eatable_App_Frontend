import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';

const DetailHome = ({id}) => {
 const [detail, setDetails] = useState([]);
    useEffect(() => {
      fetch(`http://localhost:8080/api/partner/base/detail/${id}`)
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
        <Card style={{ width: "100%", maxWidth: "700px" }}>
          <Card.Title>
            <small style={{ marginTop: "5px", marginLeft: "5px" }}>
              매장소개
            </small>
          </Card.Title>
          <Card.Body>
            <div>{detail.storeInfo}</div>
          </Card.Body>
        </Card>
        <Card style={{ width: "100%", maxWidth: "700px" }}>
          <Card.Title>
            <small style={{ marginTop: "5px", marginLeft: "5px" }}>
              오픈시간
            </small>
            <Card.Body>
              <div>{detail.openTime}</div>
            </Card.Body>
          </Card.Title>
        </Card>
        <Card style={{ width: "100%", maxWidth: "700px" }}>
          <Card.Title>
            <small style={{ marginTop: "5px", marginLeft: "5px" }}>
              예약정보
            </small>
          </Card.Title>
          <Card.Body>
            <div>{detail.reserveInfo}</div>
          </Card.Body>
        </Card>
      </>
    );
};

export default DetailHome;