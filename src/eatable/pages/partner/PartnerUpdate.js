import React, { useEffect, useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./components/PartnerWrite.css";
import { useDropzone } from "react-dropzone";
import { jwtDecode } from "jwt-decode";

const PartnerUpdate = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    const roles = decoded.auth ? decoded.auth.split(",") : [];
    isAdmin = roles.includes("ROLE_ADMIN");
  }

  let { id } = useParams();

  const [post, setPost] = useState({
    storeName: "",
    partnerName: "",
    partnerPhone: "",
    storePhone: "",
    favorite: "",
    lat: "",
    lng: "",
    area: "",
    zipCode: "",
    storeInfo: "",
    tableCnt: "",
    openTime: "",
    reserveInfo: "",
    parking: "",
    corkCharge: "",
    dog: "",
    fileList: [],
    readyTime: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    favorite: "",
    storeInfo: "",
    tableCnt: "",
    openTime: "",
    reserveInfo: "",
    parking: "",
    corkCharge: "",
    dog: "",
    readyTime: ""
  });

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    setErrorMessages((prevState) => ({
      ...prevState,
      [fieldName]: "",
    }));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dstIndex, imageId) => {
    e.preventDefault();
    const srcIndex = parseInt(e.dataTransfer.getData("index"));
    if (srcIndex !== dstIndex) {
      const newFileList = Array.from(post.fileList);
      const movedItem = newFileList[srcIndex];
      newFileList.splice(srcIndex, 1);
      newFileList.splice(dstIndex, 0, movedItem);
      setPost((prevPost) => ({
        ...prevPost,
        fileList: newFileList,
      }));
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      for (const file of acceptedFiles) {
        console.log(file.name);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (event) => {
          const newId = Math.random().toString(36).substr(2, 9);
          setPost((prevPost) => ({
            ...prevPost,
            fileList: [
              ...prevPost.fileList,
              { id: newId, imageUrl: event.target.result },
            ],
          }));
        };
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (imageId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const newFiles = post.fileList.filter((image) => image.id !== imageId);
      setPost((prevPost) => ({
        ...prevPost,
        fileList: newFiles,
      }));

      fetch(`http://localhost:8080/api/partner/remove/${imageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // 이미지 삭제 성공 시, 화면에서 업데이트
            const newFiles = post.fileList.filter(
              (image) => image.id !== imageId
            );
            setPost((prevPost) => ({
              ...prevPost,
              fileList: newFiles,
            }));
            console.log("이미지 삭제 성공");
          } else {
            // 이미지 삭제 실패
            console.error("이미지 삭제 실패");
          }
        })
        .catch((error) => {
          console.error("이미지 삭제 중 오류 발생:", error);
        });
    }
  };

  const handleImageClick = (imageId) => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    fileInput.click();

    // 파일 선택 이벤트 리스너
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const formData = new FormData();
        formData.append("file", file);

        // 이미지 업데이트 요청 전에 이미지 리스트를 업데이트합니다.
        const newImageList = post.fileList.map((image) => {
          if (image.id === imageId) {
            return { id: imageId, imageUrl: reader.result };
          }
          return image;
        });

        setPost((prevPost) => ({
          ...prevPost,
          fileList: newImageList,
        }));

        fetch(`http://localhost:8080/api/partner/updateImageUrl/${imageId}`, {
          method: "PUT",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              // navigate(`/partnerdetail/` + id);
              console.log("이미지 URL 업데이트 성공");
            } else {
              console.error("이미지 URL 업데이트 실패");
            }
          })
          .catch((error) => {
            console.error("이미지 URL 업데이트 중 오류 발생:", error);
          });
      };
    };
  };

  useEffect(() => {
    console.log("=====================================================");
    console.log(post);
    console.log("=====================================================");
  }, [post]);

  useEffect(() => {
    fetch("http://localhost:8080/api/partner/detail/" + id)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data !== null) {
          console.log(data);
          setPost(data);

          // 여기서 주소 정보를 업데이트합니다.
          setPost((prevState) => ({
            ...prevState,
            lat: data.address.lat,
            lng: data.address.lng,
            area: data.address.area,
            zipCode: data.address.zipCode,
          }));
        }
      });
  }, []);

  const postUpdate = (e) => {
    e.preventDefault();

    let hasError = true;

    const checkField = (fieldName, errorMessage) => {
      if (post[fieldName] === null || post[fieldName] === "") {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [fieldName]: errorMessage,
        }));
        hasError = false;
      }
    };

    // 호출 부분을 아래와 같이 변경합니다.
    checkField("favorite", "업종은 반드시 골라야 합니다");
    checkField("storeInfo", "가게 정보는 필수입니다");
    checkField("tableCnt", "테이블 수는 필수입니다");
    checkField("openTime", "영업 시간은 필수입니다");
    checkField("reserveInfo", "예약 주의 사항은 필수입니다");
    checkField("parking", "주차 정보는 필수입니다");
    checkField("corkCharge", "콜키지 정보는 필수입니다");
    checkField("dog", "애완견 정보는 필수입니다");

    if (!hasError) {
      return;
    }

    const formData = new FormData();
    formData.append("id", post.id);
    formData.append("storeName", post.storeName);
    formData.append("partnerName", post.partnerName);
    formData.append("partnerPhone", post.partnerPhone);
    formData.append("storePhone", post.storePhone);
    formData.append("storeInfo", post.storeInfo);
    formData.append("tableCnt", post.tableCnt);
    formData.append("openTime", post.openTime);
    formData.append("reserveInfo", post.reserveInfo);
    formData.append("favorite", post.favorite);
    formData.append("parking", post.parking);
    formData.append("corkCharge", post.corkCharge);
    formData.append("readyTime", post.readyTime);
    formData.append("dog", post.dog);

    for (const fileData of post.fileList) {
      if (fileData) {
        if (fileData.imageUrl.startsWith("data:image")) {
          const byteCharacters = atob(fileData.imageUrl.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/png" });
          const file = new File(
            [blob],
            "image.png",
            { type: "image/png" },
            fileData.id
          );
          formData.append("files", file);
        } else {
          formData.append("files", fileData);
        }
      }
    }

    fetch("http://localhost:8080/api/partner/update", {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          navigate(`/partnerdetail/${data.id}`);
          alert("수정 완료");
        } else {
          alert("수정 실패");
        }
      });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newFavorites = post.favorite
      .split(",")
      .filter((food) => food.trim() !== "");

    if (checked && newFavorites.length >= 3 && !newFavorites.includes(value)) {
      alert("3개 이상은 체크할 수 없습니다.");
      e.target.checked = false;
      return;
    }

    if (checked) {
      newFavorites.push(value);
    } else {
      newFavorites = newFavorites.filter((food) => food !== value);
    }

    setPost((prevState) => ({
      ...prevState,
      favorite: newFavorites.join(","),
    }));

    setErrorMessages((prevState) => ({
      ...prevState,
      favorite: "",
    }));
  };

  return (
    <div className="mt-3" id="partnerwrite">
      <h2 className="display-6">매장관리 - 수정</h2>
      <hr />
      <form onSubmit={postUpdate}>
        {/* 나머지 입력 부분들 */}
        {["storeName", "partnerName", "partnerPhone", "storePhone"].map(
          (fieldName, index) => (
            <div key={index} className="mt-3">
              <label htmlFor={fieldName}>
                <h5>
                  {fieldName === "storeName"
                    ? "매장이름"
                    : fieldName === "partnerName"
                    ? "관리자이름"
                    : fieldName === "partnerPhone"
                    ? "관리자 전화번호"
                    : "매장 전화번호"}
                </h5>
              </label>
              <input
                type="text"
                className="form-control"
                id={fieldName}
                placeholder={
                  fieldName === "partnerPhone"
                    ? "전화번호를 입력하세요   ex) 01042364123"
                    : fieldName === "storePhone"
                    ? "전화번호를 입력하세요   ex) 0242364123"
                    : "이름을 입력하세요"
                }
                name={fieldName}
                onChange={handleChange}
                value={post[fieldName] || ""}
                readOnly
              />
            </div>
          )
        )}

        {/* 매장주소 입력 부분 */}
        <div className="mt-3">
          <label htmlFor="address">
            <h5>매장주소</h5>
          </label>
          <div>
            <div className="act">
              {/* <input id="autocomplete_search" name="autocomplete_search" type="text" className="form-control" placeholder="Search" readOnly /> */}
              {/* <button onClick={findMyLocation}><GpsFixed /></button> */}
            </div>
            {/* 위도, 경도 입력 */}
            <input
              type="text"
              name="lat"
              id="lat"
              placeholder="lat"
              onChange={handleChange}
              value={post.lat}
              hidden
            />
            <input
              type="text"
              name="lng"
              id="lng"
              placeholder="lng"
              onChange={handleChange}
              value={post.lng}
              hidden
            />
            {/* 주소와 우편번호 입력 */}
            <input
              type="text"
              name="area"
              id="area"
              className="form-control"
              placeholder="Address"
              onChange={handleChange}
              value={post.area}
              readOnly
            />
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              className="form-control"
              placeholder="zipCode"
              onChange={handleChange}
              value={post.zipCode}
              readOnly
            />
          </div>
        </div>

        {/* 업종 선택 부분 */}
        <div className="mt-3">
          <label>
            <h5>
              업종 <small>(1개이상 선택)</small>
            </h5>
          </label>

          {[
            ["한식", "중식", "일식"],
            ["죽", "아시안", "버거"],
            ["퓨전", "찜.탕.찌개", "아메리칸"],
            ["족발.보쌈", "한우", "소고기구이"],
            ["와인", "코스요리", "고기.구이"],
            ["한정식", "양식", "중식"],
            ["다이닝바", "브런치", "카페"],
            ["치킨", "레스토랑", "피자"],
            ["분식", "국수", "돈까스"],
          ].map((group, index) => (
            <div key={index} className="row">
              {group.map((food, i) => (
                <div key={i} className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={food}
                      name="favorite"
                      onChange={handleCheckboxChange}
                      checked={
                        (post.favorite && post.favorite.includes(food)) || ""
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`favorite${index}${i}`}
                    >
                      {food}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {errorMessages.favorite && (
            <span className="text-danger">{errorMessages.favorite}</span>
          )}
        </div>

        {/* 텍스트 입력 */}
        <div className="mt-3">
          <label htmlFor="storeInfo">
            <h5>매장소개</h5>
          </label>
          <textarea
            onChange={handleChange}
            placeholder="매장소개를 입력하세요"
            id="storeInfo"
            name="storeInfo"
            value={post.storeInfo}
          ></textarea>
        </div>
        <div>
          {errorMessages.storeInfo && (
            <span className="text-danger">{errorMessages.storeInfo}</span>
          )}
        </div>
          {/* 예상 소요시간
          <span>
            <label htmlFor="tableCnt">
              <h5>예상 소요시간</h5>
            </label>
            <div style={{display:"flex" }}>
            <input
              type="number"
              className="form-control"
              id="readyTime"
              placeholder="예상 시간 분 단위입니다."
              name="readyTime"
              min="0"
              onChange={handleChange}
              value={post.readyTime}
              style={{ width: "100%", maxWidth: "500px" }}
            />
            <span style={{width: "100%" , maxWidth: "400px", marginTop:"9px"}}>분</span>
            </div>
          </span> */}
        {/* 테이블수 */}
        <div className="mt-3">
          <label htmlFor="tableCnt">
            <h5>테이블수</h5>
          </label>
          <input
            type="number"
            className="form-control"
            id="tableCnt"
            placeholder="테이블수를 입력하세요"
            name="tableCnt"
            min="0"
            onChange={handleChange}
            value={post.tableCnt}
          />
        </div>
        <div>
          {errorMessages.tableCnt && (
            <span className="text-danger">{errorMessages.tableCnt}</span>
          )}
        </div>

        {/* 영업시간 */}
        <div className="mt-3">
          <label htmlFor="openTime">
            <h5>
              영업시간 <small>(정기휴무)</small>
            </h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="openTime"
            placeholder="영업시간을 입력하세요"
            name="openTime"
            onChange={handleChange}
            value={post.openTime}
          />
        </div>
        <div>
          {errorMessages.openTime && (
            <span className="text-danger">{errorMessages.openTime}</span>
          )}
        </div>

        {/* 텍스트 입력 */}
        <div className="mt-3">
          <label htmlFor="reserveInfo">
            <h5>예약주의사항</h5>
          </label>
          <textarea
            onChange={handleChange}
            placeholder="여기에 입력하세요"
            id="reserveInfo"
            name="reserveInfo"
            value={post.reserveInfo}
          ></textarea>
        </div>
        <div>
          {errorMessages.reserveInfo && (
            <span className="text-danger">{errorMessages.reserveInfo}</span>
          )}
        </div>

        {/* radio타입 입력 */}
        <div className="mt-3">
          {["parking", "corkCharge", "dog"].map((item, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`${item}Radio`}>
                {item === "corkCharge"
                  ? "콜키지"
                  : item === "dog"
                  ? "애완견"
                  : "주차정보"}
              </label>
              <div className="d-flex">
                <div
                  className="form-check"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name={item}
                    id={`${item}Available`}
                    value="TRUE"
                    onChange={handleChange}
                    checked={post[item] === "TRUE"}
                    style={{ marginRight: "5px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${item}Available`}
                    style={{ marginRight: "10px" }}
                  >
                    가능
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name={item}
                    id={`${item}NotAvailable`}
                    value="FALSE"
                    onChange={handleChange}
                    checked={post[item] === "FALSE"}
                    style={{ marginRight: "5px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${item}NotAvailable`}
                  >
                    불가능
                  </label>
                </div>
              </div>
              {errorMessages[item] && (
                <span className="text-danger">{errorMessages[item]}</span>
              )}
            </div>
          ))}
        </div>

        {/* 첨부파일 */}
        <div className="mt-3">
          <label>
            <h5>첨부파일</h5>
          </label>
          <div className="dropzoneContainer" onDragOver={handleDragOver}>
            <div
              className={"gallery--box " + (post.fileList.length > 0 && "true")}
              {...getRootProps()}
            >
              <input type="file" {...getInputProps()} />
              <div className="plus--btn">+</div>
              {post.fileList.length === 0 && (
                <div className="no--case">
                  <span className="text">
                    Drop files here or click to upload.
                  </span>
                  <br />
                </div>
              )}
            </div>
            {post.fileList.map((image, idx) => (
              <div
                key={idx}
                className="gallery--list"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, idx)}
                onDrop={(e) => handleDrop(e, idx, image.id)}
                onDragOver={handleDragOver}
              >
                <div className="gallery--box">
                  <img
                    src={image.imageUrl}
                    alt=""
                    onClick={() => handleImageClick(image.id)}
                  />
                </div>
                <div
                  className="minus--btn"
                  onClick={() => removeFile(image.id)}
                >
                  -
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="d-flex justify-content-end my-3">
          <button type="submit" className="button-link">
            수정완료
          </button>

          <button
            type="button"
            className="button-link"
            onClick={() => {
              navigate(-1) ? navigate(-1) : navigate("/home");
            }}
          >
            뒤로가기
          </button>

          <div>
            {/* 관리자 권한이 있을때만 보여줌 */}
            {isAdmin && (
              <Link className="button-link" to="/partnerlist">
                목록
              </Link>
            )}
          </div>
        </div>
      </form>
      {/* 하단 버튼 */}
    </div>
  );
};

export default PartnerUpdate;
