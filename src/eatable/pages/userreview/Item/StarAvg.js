import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // react-icons 라이브러리에서 FaStar 아이콘을 사용
import "./StarAvg.css";



const StarAvg = ({ rating, setRating }) => {
  const [animate, setAnimate] = useState(false);

  const handleSetRating = (index) => {
    setRating(index);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500); // 애니메이션 지속 시간과 일치하게 설정
  };

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`${animate ? "scale-animate" : ""} ${
              index <= rating ? "on" : "off"
            }`}
            onClick={() => handleSetRating(index)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              margin: "0 -15px",
            }}
          >
            <FaStar color={index <= rating ? "#ffc107" : "#e4e5e9"} size={24} />
          </button>
        );
      })}
    </div>
  );
};

export default StarAvg;
