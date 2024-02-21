import React from "react";

const ImageGallery = ({ images }) => {
  let gridTemplateColumns;
  let gridTemplateRows = "1fr"; // 기본적으로 1행 구성
  if (images.length === 1) {
    gridTemplateColumns = "1fr";
  } else if (images.length === 2) {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "500px"; // 2개일 때 높이를 500px로 설정
  } else if (images.length === 3) {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "250px 500px"; // 3개일 때 높이를 각각 250px로 설정하여 총 500px
  } else if (images.length === 4) {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "250px 250px"; // 4개일 때도 동일하게 높이 설정
  } else {
    gridTemplateColumns = "1fr 1fr 1fr";
    gridTemplateRows = "250px 250px"; // 4개 이상일 때도 동일하게 높이 설정
  }

  return (
    <div>
      <style>
        {`
    .image-gallery {
      display: grid;
      gap: 2px;
      margin: auto;
      maxWidth: '500px', 
      maxHeight: '500px', 
      overflow: 'hidden' // 컨테이너 최대 크기 설정
    }

    .image-container {
      position: relative;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
    }

    .image-container img {
      width: 100%;
      height: 100%; 
      object-fit: cover; // 이미지가 컨테이너 내에서 꽉 차도록 설정
    }
    `}
      </style>
      <div className="image-gallery" style={{ gridTemplateColumns }}>
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={image.src} alt={image.alt} />
            {index === 3 && images.length > 4 && (
              <div className="image-overlay">+{images.length - 3}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
