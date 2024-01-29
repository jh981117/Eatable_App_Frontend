// components/MenuSection.js

import React, { useState, useEffect } from 'react';
import MenuList from './MenuList';

const MenuSection = () => {
  // 실제로는 데이터베이스에서 가져올 메뉴 데이터
  const initialMenuData = [
    { name: '아메리카노', price: 3000 },
    { name: '라떼', price: 4000 },
    { name: '가떼', price: 5000 },
    { name: '나떼', price: 14000 },
    { name: '다떼', price: 24000 },
    { name: '라떼', price: 34000 },
    { name: '마떼', price: 45000 },
    { name: '바떼', price: 3500 },
    { name: '사떼', price: 6300 },
    { name: '라떼', price: 8000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    { name: '라떼', price: 4000 },
    // ... 기타 메뉴 데이터 ...
  ];

  const [menuData, setMenuData] = useState(initialMenuData);
  const [visibleMenuCount, setVisibleMenuCount] = useState(8);

  const handleShowMore = () => {
    // "메뉴 더보기" 버튼 클릭 시 메뉴 개수를 추가로 보여주도록 업데이트
    setVisibleMenuCount(prevCount => prevCount + 8);
  };

  useEffect(() => {
    // TODO: 데이터베이스에서 메뉴 데이터를 가져오는 비동기 작업 수행

    // 여기서는 가상의 setTimeout을 사용하여 1초 후에 메뉴 데이터를 업데이트합니다.
    setTimeout(() => {
      setMenuData(initialMenuData);
    }, 1000);
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 함

  return (
    <div>
      <MenuList menuData={menuData.slice(0, visibleMenuCount)} />
      {visibleMenuCount < menuData.length && (
        <button onClick={handleShowMore}>메뉴 더보기</button>
      )}
    </div>
  );
};

export default MenuSection;