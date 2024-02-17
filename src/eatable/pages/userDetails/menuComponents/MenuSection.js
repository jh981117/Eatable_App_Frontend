import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MenuList from './MenuList';

const MenuSection = () => {
  const [menuData, setMenuData] = useState([]);
  const [visibleMenuCount, setVisibleMenuCount] = useState(8);
  const [initialMenuData, setInitialMenuData] = useState([]);

  let { id } = useParams();

  const handleShowMore = () => {
    setVisibleMenuCount(prevCount => prevCount + 8);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/partner/partnerMenuList/${id}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (data !== null) {
          console.log(data);
          setInitialMenuData(data);
        }
      });
  }, [id]);

  useEffect(() => {
    // initialMenuData가 변경될 때마다 menuData 상태 업데이트
    setMenuData(initialMenuData);
  }, [initialMenuData]);

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
