import React from 'react';
import { Container, Image, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApplyReq from '../admin/ApplyReq';
import { styled } from 'styled-components';

const StyleLink = styled(Link)`
    text-decoration: none;
    color: black;
    &:hover {
        color: gray;
    }
`
const StyleNavbar = styled(Navbar)`
   position: fixed; 
  bottom: 0;
  width: 100%;
  background-color: #f8f9fa;  
  text-align: center;
 
`

const StyleDiv =styled.div`
    padding-top: 80px;
`
const Footer = () => {
    return (
        <div>
            <StyleDiv></StyleDiv>
         <StyleNavbar bg="light" variant="light">
            <Container style={{ width: "100%", maxWidth: "1200px" }}>
                <Navbar.Brand>
                    <Link to="/home">
                    <Image
                        src="https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708150496729-logo.png"
                        style={{ width: "100px" }}
                    />
                    </Link>
                </Navbar.Brand>
                    <h6>주소 : 서울특별시 강남구 역삼동</h6>
                    <h6>연락처 : 010 - 0000 -1111</h6>
                    <StyleLink to="/applyreq">
                        <h6>입점신청</h6>
                    </StyleLink>
                      
            </Container> 

            
         </StyleNavbar>
        </div>
    );
};

export default Footer;