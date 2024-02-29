import React, { useRef, useEffect, useState } from "react";
import "./components/Roulette.css";
import { ToastContainer, toast } from "react-toastify";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Roulette = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  let inputValue = "";

  const originalProducts = [
    // "한식", "중식", "일식", "이탈리아", "프랑스", "유러피안", "퓨전", "스페인", "아메리칸", "스시", "한우", "소고기구이", "와인", "코스요리", "고기요리", "한정식", "파스타", "해물", "다이닝바", "브런치", "카페", "치킨", "레스토랑", "피자", "백반", "국수", "비건"
    "족발.보쌈",
    "돈까스",
    "고기.구이",
    "피자",
    "찜.탕.찌개",
    "양식",
    "중식",
    "아시안",
    "치킨",
    "한식",
    "버거",
    "분식",
  ];

  const getRandomProducts = (arr, num) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const product = getRandomProducts(originalProducts, 9);
  console.log(product);

  const colors = [
    "#dc0936",
    "#e6471d",
    "#f7a416",
    "#efe61f ",
    "#60b236",
    "#209b6c",
    "#169ed8",
    "#3f297e",
    "#87207b",
    "#be107f",
    "#e7167b",
  ];

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const [cw, ch] = [
      canvasRef.current.width / 2,
      canvasRef.current.height / 2,
    ];
    const arc = Math.PI / (product.length / 2);

    for (let i = 0; i < product.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % (colors.length - 1)];
      ctx.moveTo(cw, ch);
      ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
      ctx.fill();
      ctx.closePath();
    }

    ctx.fillStyle = "#fff";
    ctx.font = "18px Pretendard";
    ctx.textAlign = "center";

    for (let i = 0; i < product.length; i++) {
      const angle = arc * i + arc / 2;

      ctx.save();

      ctx.translate(
        cw + Math.cos(angle) * (cw - 50),
        ch + Math.sin(angle) * (ch - 50)
      );

      ctx.rotate(angle + Math.PI / 2);

      product[i].split(" ").forEach((text, j) => {
        ctx.fillText(text, 0, 30 * j);
      });

      ctx.restore();
    }
  }, [product, colors]);

  const rotate = () => {
    const canvas = canvasRef.current;
    canvas.style.transform = `initial`;
    canvas.style.transition = `initial`;

    setTimeout(() => {
      const ran = Math.floor(Math.random() * product.length);
      inputValue = product[ran];

      const arc = 360 / product.length;
      const rotate = ran * arc + 3600 + arc * 3 - arc / 4;

      canvas.style.transform = `rotate(-${rotate}deg)`;
      canvas.style.transition = `2s`; // 2초에 걸쳐 회전 css

      const expressions = [
        `오늘은 ${product[ran]} 어때? `,
        `${product[ran]} 땡기는데 같이 먹을래? `,
        `${product[ran]} 생각나서 먹고 싶은데, 어때? `,
        `이번에 ${product[ran]} 먹어보는 거 어떨까? `,
        `오늘은 ${product[ran]} 시켜볼까? `,
        `${product[ran]} 맛있게 먹을래? `,
        `슬슬 배고픈데, 오늘은 ${product[ran]} 어때? `,
        `${product[ran]} 주문해서 같이 먹을래? `,
        `${product[ran]} 먹을 만한데 어때? `,
        `${product[ran]} 시켜서 맛있게 먹자! `,
        `${product[ran]} 땡기는 거 같아서 추천해봤어. `,
        `이럴 땐 ${product[ran]} 어때? `,
        `오늘은 ${product[ran]} 시켜서 먹어볼까? `,
        `${product[ran]} 시켜서 조금씩 나눠서 먹어볼까? `,
        `오늘은 ${product[ran]} 먹고 싶은데 같이 먹을래? `,
        `${product[ran]} 먹으면서 영화나 볼까? `,
        `${product[ran]} 먹으면서 이야기 나눠볼까? `,
        `${product[ran]} 먹으면서 재미있는 게임이나 하자! `,
        `오늘 저녁은 ${product[ran]} 어때? `,
        `${product[ran]} 먹을 때 좋아하는 영화나 드라마 추천해줄래? `,
      ];

      const selectedExpression =
        expressions[Math.floor(Math.random() * expressions.length)];

      setTimeout(() => {
        toast(`${selectedExpression} `);
      }, 2000);
    }, 1); // 클릭후 1초뒤에 스핀 시작
  };

  const handleToastClose = () => {
    navigate(`/searchpage?keyword=${inputValue}`);
  };

  return (
    <Container>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        onClose={handleToastClose}
      />

      <div id="rouletteContainer">
        <canvas
          ref={canvasRef}
          id="rouletteCanvas"
          width="380"
          height="380"
          style={{ transform: "rotate(0deg)", transition: "transform 2s" }}
        ></canvas>
        <button id="rotateButton" onClick={rotate}>
          룰렛 돌리기
        </button>
      </div>
    </Container>
  );
};

export default Roulette;
