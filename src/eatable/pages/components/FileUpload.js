import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFileToServer = () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://localhost:8080/api/attachments/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답이 실패했습니다.");
        }
        console.log("파일 업로드 성공");
        // 추가 작업: 업로드 성공 시 처리할 내용을 추가하세요.
      })
      .catch((error) => {
        console.error("파일 업로드 실패: ", error);
      });
  };

  useEffect(() => {
    // 이미지 정보를 가져오는 API 호출
    fetch("http://localhost:8080/api/attachments/img")
      .then((response) => response.json())
      .then((data) => {
        setImageUrls(data);
      })
      .catch((error) => {
        console.error("이미지 정보를 가져오는 데 실패했습니다.", error);
      });
  }, []);

  return (
    <div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={uploadFileToServer}>업로드</button>

      {/* 이미지를 화면에 표시 */}
      {imageUrls.map((imageUrl) => (
        <img
          key={imageUrl.id}
          src={imageUrl.imageUrl}
          alt={imageUrl.description}
        />
      ))}
    </div>
  );
};

export default FileUpload;
