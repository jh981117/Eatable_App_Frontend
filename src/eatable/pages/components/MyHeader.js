import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS 불러오기
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Header = styled.header`
  background-color: #f5f5f5;
  padding: 10px;
`;

const Logo = styled.div`
  /* 로고 스타일링 */
`;

const SearchIcon = styled(FontAwesomeIcon)`
  cursor: pointer; /* 아이콘에 마우스 커서를 손가락 모양으로 변경 */
`;

const SearchBar = styled.input.attrs({
  type: "text",
  placeholder: "검색...",
})`
  display: ${(props) => (props.isSearchOpen ? "block" : "none")};
  width: 30%; /* 검색 바를 부모 요소에 맞게 100%로 설정 */
`;

const MyHeader = () => {
  const [isSearchOpen, setSearchOpen] = useState(false); // 검색 바의 초기 가시성 상태를 닫혀있는 상태로 설정

  // 검색 아이콘을 클릭했을 때 검색 바의 가시성을 토글하는 함수
  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  return (
    <Header className="container-fluid">
      <div className="row align-items-center">
        <Logo className="col-auto">로고</Logo> {/* 로고 부분 */}
      

  
        <div className="col-auto">
          <Link to="/login" className="btn btn-primary">
            로그인
          </Link>{" "}
          {/* 로그인 버튼 */}
          <Link to="/signup" className="btn btn-secondary">
            회원가입
          </Link>{" "}
          {/* 회원가입 버튼 */}
        </div>
      </div>
    </Header>
  );
};

export default MyHeader;
