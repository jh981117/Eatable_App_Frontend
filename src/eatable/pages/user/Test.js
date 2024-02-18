import React from 'react';
 

const Test = (props) => {
  const { bgcolor, completed } = props;
   const containerStyles = {
     height: "40px",
     width: "20px",
     backgroundColor: "#e0e0de",
     borderRadius: "50px",
     margin: "50px auto",
     display: "flex", // Flexbox를 사용합니다.
     flexDirection: "column-reverse", // 내용을 아래에서 위로 채웁니다
   };

   const fillerStyles = {
     height: `${completed}%`,
     width: "100%",
     backgroundColor: bgcolor,
     borderRadius: "inherit",
     textAlign: "center", // 텍스트를 가운데 정렬합니다.
     display: "flex",
     alignItems: "flex-end", // 내부 텍스트를 아래에 위치시킵니다
   };

   const labelStyles = {
     padding: 5,
     color: "white",
     fontWeight: "bold",
   };

 
  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default Test;