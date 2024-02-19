import React, { useEffect, useState } from 'react';
import MenuListCRUD from './MenuListCRUD';

const MenuSectionCRUD = ({ id }) => {
  const [menuData, setMenuData] = useState([]);
  const [visibleMenuCount, setVisibleMenuCount] = useState(8);
  const [initialMenuData, setInitialMenuData] = useState([]);

  const handleShowMore = () => {
    setVisibleMenuCount(prevCount => prevCount + 8);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/partner/partnerMenuList/${id}`)
      .then(response => {
        console.log(response.status)
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
  console.log('id:' +id)

  useEffect(() => {
    // 초기 메뉴 데이터가 비어 있지 않은 경우에만 menuData를 업데이트합니다.
    if (initialMenuData.length > 0) {
      setMenuData(initialMenuData);
    }
    console.log(initialMenuData)
  }, [initialMenuData]);

  return (
    <div>
      {/* MenuListCRUD 컴포넌트에 id 값을 props로 전달 */}
      <MenuListCRUD menuData={menuData.slice(0, visibleMenuCount)} id={id} />
      {visibleMenuCount < menuData.length && (
        <button onClick={handleShowMore}>메뉴 더보기</button>
      )}
    </div>
  );
};

export default MenuSectionCRUD;
