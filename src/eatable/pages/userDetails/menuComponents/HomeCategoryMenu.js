import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const HomeCategoryMenu = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState([]);
  const scrollRef = useRef(null);
  const draggingInfo = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    animationFrameId: null,
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/partner/homePartnerMenuList/${id}`)
      .then((response) => response.json())
      .then((data) => setMenus(data))
      .catch((error) => console.error("메뉴 불러오기 실패:", error));
  }, [id]);

  console.log(menus, "메뉴들")
  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const startDragging = (e) => {
    draggingInfo.current.isDragging = true;
    draggingInfo.current.startX = e.pageX;
    draggingInfo.current.scrollLeft = scrollRef.current.scrollLeft;
    draggingInfo.current.lastX = e.pageX;
    if (draggingInfo.current.animationFrameId) {
      cancelAnimationFrame(draggingInfo.current.animationFrameId);
      draggingInfo.current.animationFrameId = null;
    }
  };

  const onDragging = (e) => {
    if (!draggingInfo.current.isDragging) return;
    const currentX = e.pageX;
    // 드래그 방향에 따른 스크롤 이동 계산
    const dx = currentX - draggingInfo.current.lastX;
    scrollRef.current.scrollLeft -= dx; // 스크롤 방향 조정
    draggingInfo.current.velocity = dx; // 속도는 마지막 이동 거리로 설정
    draggingInfo.current.lastX = currentX;
  };

 const stopDragging = () => {
   if (!draggingInfo.current.isDragging) return;
   draggingInfo.current.isDragging = false;

   const decelerate = () => {
     // velocity가 충분히 작아질 때까지 계속 감속
     if (Math.abs(draggingInfo.current.velocity) <= 1) {
       cancelAnimationFrame(draggingInfo.current.animationFrameId);
       return;
     }
     scrollRef.current.scrollLeft -= draggingInfo.current.velocity; // 스크롤 이동
     // 속도 감속 (마찰력 효과)
     draggingInfo.current.velocity *= 0.96;
     draggingInfo.current.animationFrameId = requestAnimationFrame(decelerate);
   };
   decelerate();
 };

  return (
    <>
      <div>
        <small>메뉴정보</small>
      </div>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          overflowX: "auto",
          cursor: "grab",
          userSelect: "none",
          // 스크롤 영역의 다른 스타일 속성 추가
          padding: "0px",
          gap: "10px",
          backgroundColor: "#f0f0f0", // 배경색 추가 예시
        }}
        onMouseDown={startDragging}
        onMouseMove={onDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onDragStart={preventDragHandler}
      >
        {menus.map((menu) => (
          <Card
            key={menu.id}
            style={{
              flex: "0 0 auto",
            //   marginRight: "10px",
            
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {" "}
            
            <Card.Header>
              <div>{menu.name}</div>
            </Card.Header>
            <Card.Body>
              <img
                src={menu.menuImageUrl}
                alt={`Menu ${menu.name}`}
                style={{ width: "350px", height: "auto", borderRadius: "10px" }}
                onDragStart={preventDragHandler}
              />
              <div style={{ marginTop: "5px", marginLeft: "0px" }}>
                {menu.price}원
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default HomeCategoryMenu;
