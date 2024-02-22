import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ImageGallery = ({ images }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
  // 이미지 갯수에 따라 grid 스타일 동적 설정
  const getGalleryStyle = () => {
    let style = {
      display: "flex", // 오타 수정: "fiex" -> "flex"
      flexDirection: "row", // 기본값으로 row 설정
      flexWrap: "wrap", // 이미지를 여러 줄로 나열하기 위해 wrap 설정
      gap: "5px",
      maxWidth: "500px",
      height: "auto",

    };

    if (images.length === 1) {
      // 이미지가 하나일 때
      style.display = "flex";
      style.flexDirection = "column"; // 중앙 정렬을 위해 column 설정
      style.alignItems = "center"; // 가운데 정렬
    } else if (images.length === 2) {
      // 이미지가 두 개일 때
      style.display = "grid";
      style.gridTemplateColumns = "1fr 1fr";
    } else if (images.length === 3) {
      // 이미지가 세 개 또는 네 개일 때
      style.display = "grid";
      style.gridTemplateColumns = "1fr 1fr";
    } else if (images.length >= 4) {
      style.display = "grid";
      style.gridTemplateColumns = "1fr 1fr";
    }
    return style;
  };

  const imageStyle = (index) => ({
    width: "100%", // 이미지 너비를 컨테이너에 맞춤
    height: "100%", // 이미지 높이를 자동으로 조절
    objectFit: images.length === 1 ? "contain" : "cover", // 이미지가 하나일 때는 contain, 그렇지 않을 때는 cover
    opacity: index === 3 && images.length > 4 ? 0.5 : 1, // 네 번째 이미지에 투명도 적용하여 나머지 이미지 수 표시
  });



  const galleryStyle = getGalleryStyle();


   return (
     <>
       <div style={galleryStyle}>
         {images.slice(0, 4).map((image, index) => (
           <div
             key={index}
             style={{
               width: "100%",
               overflow: "hidden",
               height:
                 images.length === 1 || images.length === 3? "100%" : "250px",
               position: "relative",
               objectFit: "cover",
             }}
           >
             <img
               src={image.src}
               alt={`Gallery Image ${index}`}
               style={imageStyle(index)}
             />
             {index === 3 && images.length > 4 && (
               <div
                 onClick={handleShowModal} // 클릭 시 모달 토글
                 style={{
                   position: "absolute",
                   top: 0,
                   left: 0,
                   width: "100%",
                   height: "100%",
                   display: "flex",
                   justifyContent: "center",
                   alignItems: "center",
                   backgroundColor: "rgba(0, 0, 0, 0.5)",
                   color: "white",
                   fontSize: "20px",
                   cursor: "pointer", // 클릭 가능함을 나타내는 커서 스타일
                 }}
               >
                 +{images.length - 4}
               </div>
             )}
           </div>
         ))}
       </div>
       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
         <Modal.Header closeButton>
           <Modal.Title>이미지 갤러리</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <div
             className="image-gallery"
             style={{
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "center", // 이미지를 가운데 정렬
             }}
           >
             {images.map((image, index) => (
               <div
                 key={index}
                 style={{
                   flex: "1 1 auto", // 컨테이너 크기에 따라 유연하게 크기 조절
                   maxWidth: "300px", // 컨테이너 최대 너비
                   maxHeight: "300px",
                   margin: "5px", // 이미지 간 간격
                   display: "flex",
                   justifyContent: "center", // 이미지를 div 내에서 가운데 정렬
                 }}
               >
                 <img
                   src={image.src}
                   alt={`Gallery Image ${index}`}
                   style={{
                     width: "100%",
                     height: "100%",
                     maxWidth: "300px", // 이미지 최대 너비
                     maxHeight: "300px", // 이미지 최대 높이
                     objectFit: "cover", // 컨테이너를 꽉 채우면서 이미지 비율 유지
                   }}
                 />
               </div>
             ))}
           </div>
         </Modal.Body>

         <Modal.Footer>
           <Button variant="secondary" onClick={handleCloseModal}>
             닫기
           </Button>
         </Modal.Footer>
       </Modal>
     </>
   );
};

export default ImageGallery;