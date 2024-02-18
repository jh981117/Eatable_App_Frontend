// // import React, { useEffect, useState } from 'react';
// // import "./TemperatureCSS.css";


// // const Temperature = () => {

// //     const [celsius, setCelsius] = useState('');
// //     const [temperature, setTemperature] = useState('');
// //     const [profile, setProfile] = useState(null);
// //     const [error, setError] = useState(null);

 
// // // 사용자 정보 받아오기
// // useEffect(() => {
// //     const fetchProfile = async () => {
// //     const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 확인

// //     if (!token) {
// //        console.error("No token found");
// //        return;
// //       }

// //     try {
// //         const response = await fetch("http://localhost:8080/api/user/profile", {
// //         method: "GET",
// //         headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //         },
// //         });

// //         if (!response.ok) {
// //         throw new Error(`Error! status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         setProfile(data);
// //         setTemperature(data.temperature);
// //     } catch (error) {
// //         console.error("Error:", error);
// //         setError(error);
// //     }
// // };

// // fetchProfile();
// // }, []);

// // if (error) {
// // return <div>Error fetching profile: {error.message}</div>;
// // }
// // if (!profile) {
// // return <div>Loading...</div>; // 또는 로딩 표시, 에러 메시지 등
// // }

//       // 온도바
// //   const tempColor = (temperature) => {
// //     if (temperature >= 20) {
// //       return "Red";
// //     } else if (temperature >= 10) {
// //       return "OrangeRed";
// //     } else if (temperature >= 0) {
// //       return "Tomato";
// //     } else if (temperature >= -10) {
// //       return "DodgerBlue";
// //     } else if (temperature >= -20) {
// //       return "RoyalBlue";
// //     } else if (temperature >= -30) {
// //       return "Blue";
// //     } else if (temperature >= -40) {
// //       return "MediumBlue";  
// //     } else if (temperature >= -50) {
// //       return "Navy";
// //     } else {
// //       return "Gray"; // 기본값은 회색
// //     }
// //   };
    
// //     const color = tempColor(parseInt(temperature));
// //  // 막대의 길이 및 위치 계산
// //  let barHeight = "0%";
// //  let barTop = "60%";


// //  if (temperature >= 0 && temperature <= 30) {
// //      barHeight = `${temperature/2}%`;
// //      barTop = `0%`;
// //  } else if (temperature < 0 && temperature >= -50) {
// //      barHeight = `${-temperature/2}%`;
// //      barTop = `60%`;
// //  }

 
// //     const handleCelsiusChange = (e) => {
// //       const celsiusValue = parseFloat(e.target.value);
// //       setCelsius(celsiusValue);
// //       setTemperature(celsiusValue); // 온도값 변경
// //     }
 
// //     return (
// //         <div className="temperature-converter" >
// //         <h2>온도계</h2>
// //         <svg viewBox="0 0 100 200" className="thermometer" >
// //           <rect x="40" y="10" width="20" height="100" fill="#ccc" rx="10" ry="10" />
// //           {/* <rect x="40" y={65 -temperature} width="20" height={temperature} fill={tempColor(celsius)} /> */}
// //           <rect x="40" y="60" width="20" height={-barHeight} fill={tempColor(celsius)} rx="10" ry="10" />
// //           <line x1="40" y1="60" x2="60" y2="60" stroke="black" strokeWidth="1"  />
// //           <text x="15" y="110" fontSize="12" fill="black">-50</text>
// //           <text x="20" y="60" fontSize="12" fill="black">0</text>
// //           <text x="20" y="15" fontSize="12" fill="black">30</text>
// //           <text x="70" y="15" fontSize="12" fill={tempColor(celsius)}>{celsius}°C</text>
// //         </svg>
// //         <div className="input-group">
// //           <label>온도:</label>
// //           <input
// //             type="number"
// //             value={celsius}
// //             onChange={handleCelsiusChange}
// //             className="input-field"
            
// //           />
// //         </div>
// //       </div>
      
// //     );
// //   }
  

// // export default Temperature;



// import React, { useState } from 'react';

// const MyComponent = () => {
//     const [temperature, setTemperature] = useState(25); // 초기 온도값 설정

//     const tempColor = (temperature) => {
//         if (temperature >= 20) {
//             return "Red";
//         } else if (temperature >= 10) {
//             return "OrangeRed";
//         } else if (temperature >= 0) {
//             return "Tomato";
//         } else if (temperature >= -10) {
//             return "DodgerBlue";
//         } else if (temperature >= -20) {
//             return "RoyalBlue";
//         } else if (temperature >= -30) {
//             return "Blue";
//         } else if (temperature >= -40) {
//             return "MediumBlue";  
//         } else if (temperature >= -50) {
//             return "Navy";
//         } else {
//             return "Gray"; // 기본값은 회색
//         }
//     };

//     const imageUrl = 'https://img.freepik.com/premium-vector/thermometer-hot-monochrome-flat-vector-object-weather-temperature-hot-summer-wave-heat-editable-black-and-white-thin-line-icon-simple-cartoon-clip-art-spot-illustration-for-web-graphic-design_151150-17725.jpg';
//     const svgUrl = 'file:///C:/Users/My%20PC/Downloads/temperature.svg';
//     return (
//         <div>
//       <img
//         src={imageUrl}
//         style={{
//           width: "40px",
//           filter: opacity(0.5) drop-shadow(0 0 0 red);
//         }}
//       />
//         </div>
//     );
// }

// export default MyComponent;

