import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './components/PartnerWrite.css';
import { GpsFixed } from '@material-ui/icons';
import emailjs from "@emailjs/browser";
import { Form } from 'react-bootstrap';

const PartnerWrite = () => {
  const navigate = useNavigate();

  ////////구분선//////////////
  const { userId } = useParams();
  ////////구분선//////////////

  const [post, setPost] = useState({
    userId: "",
    storeName: "",
    partnerName: "",
    partnerPhone: "",
    storePhone: "",
    favorite: "",
    lat: "",
    lng: "",
    area: "",
    zipCode: "",
    district: "", // 새로 추가한 구 정보 상태
  });
  console.log(post)
  const [errorMessages, setErrorMessages] = useState({
    storeName: "",
    partnerName: "",
    partnerPhone: "",
    storePhone: "",
    favorite: "",
    lat: "",
    lng: "",
    area: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    setErrorMessages(prevState => ({
      ...prevState,
      [fieldName]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    const requiredFields = [
      "storeName",
      "partnerName",
      "partnerPhone",
      "storePhone",
      "area",
    ];

    requiredFields.forEach((fieldName) => {
      if (!post[fieldName]) {
        const errorMessage =
          fieldName === "storeName"
            ? "매장이름은"
            : fieldName === "partnerName"
              ? "관리자이름은"
              : fieldName === "partnerPhone"
                ? "관리자 전화번호는"
                : fieldName === "storePhone"
                  ? "매장 전화번호는"
                  : "주소는";
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          [fieldName]: `${errorMessage} 필수입니다`,
        }));
        hasError = true;
      }
    });

    if (hasError) return;

    fetch("http://localhost:8080/api/partner/write", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(post),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data !== null) {
          alert('제출완료');
          navigate(`/partnerdetail/${data.id}`);
        } else {
          alert("제출실패");
        }
      });
  };

  //email js//
  // const form = useRef();

  // const sendEmail = e => {
  //   e.preventDefault();

  //   emailjs.sendForm("service_fch3yro1", "template_76jxtmb1",form.current, "ORegbfZuljHYVzE1s1").then(
  //     result => {
  //       alert("성공적으로 이메일이 전송되었습니다.");        
  //     },
  //     error => {
  //       console.log(error.text);
  //       alert("이메일이 전송이 실패되었습니다.");
  //     },
  //   );
  // };

  ////////구분선//////////////
  useEffect(() => {
    if (userId) {
      setPost((prevState) => ({
        ...prevState,
        userId: userId,
      }));
    }
  }, [userId]); // userId가 변경될 때마다 실행

  //구분선 //////////

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => initialize();

    return () => document.body.removeChild(script);
  }, []);

  const handleSetPost = (key, value) => {
    setPost((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const initialize = () => {
    const input = document.getElementById("autocomplete_search");
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();

      // 장소 없을때 ---------------------------------------------------
      if (!place.geometry || !place.geometry.location) {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          { input: input.value },
          function (predictions, status) {
            if (status === "OK" && predictions) {
              const placeService = new window.google.maps.places.PlacesService(
                document.createElement("div")
              );

              input.value = predictions[0].description;

              placeService.getDetails(
                { placeId: predictions[0].place_id },
                function (placeDetails, placeStatus) {
                  console.log(placeDetails);

                  if (placeStatus === "OK") {
                    handleSetPost("lat", placeDetails.geometry.location.lat());
                    handleSetPost("lng", placeDetails.geometry.location.lng());
                    handleSetPost("area", placeDetails.formatted_address);

                    document.getElementById("lat").value =
                      placeDetails.geometry.location.lat();
                    document.getElementById("lng").value =
                      placeDetails.geometry.location.lng();
                    document.getElementById("area").value =
                      placeDetails.formatted_address;

                    for (
                      let i = 0;
                      i < placeDetails.address_components.length;
                      i++
                    ) {
                      const addressType =
                        placeDetails.address_components[i].types[0];
                      if (addressType === "postal_code") {
                        handleSetPost(
                          "zipCode",
                          placeDetails.address_components[i].long_name
                        );
                        document.getElementById("zipCode").value =
                          placeDetails.address_components[i].long_name;
                        break;
                      }
                    }
                  } else {
                    alert("근접한 장소의 세부 정보를 가져올 수 없습니다.");
                  }
                }
              );
            }
          }
        );
        return;
      }
      // 장소있을때 -----------------------------------------------------------

      handleSetPost("lat", place.geometry.location.lat());
      handleSetPost("lng", place.geometry.location.lng());
      handleSetPost("area", place.formatted_address);

      document.getElementById("lat").value = place.geometry.location.lat();
      document.getElementById("lng").value = place.geometry.location.lng();
      document.getElementById("area").value = place.formatted_address;

      // 주소 파싱하여 구 추출하기 -------------------------------------------
      const addressComponents = place.address_components;

      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("sublocality_level_1")) {
          // 구 = component.long_name;
          handleSetPost(
            "district",
            component.long_name
          );
          document.getElementById("district").value = component.long_name;
        }
      }


      // 우편번호 찾기 -----------------------------------------------------------  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: place.geometry.location },
        function (results, status) {
          if (status === "OK") {
            if (results[0]) {
              for (let i = 0; i < results[0].address_components.length; i++) {
                const addressType = results[0].address_components[i].types[0];
                if (addressType === "postal_code") {
                  handleSetPost(
                    "zipCode",
                    results[0].address_components[i].long_name
                  );
                  document.getElementById("zipCode").value =
                    results[0].address_components[i].long_name;
                  break;
                }
              }
            } else {
              alert("우편번호를 찾을 수 없습니다.");
            }
          } else {
            alert("Geocoder에 문제가 발생했습니다.");
          }
        }
      );
    });

    input.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });
  };

  // 현재위치기반 --------------------------------------------------------------
  const findMyLocation = (event) => {
    event.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          handleSetPost("lat", latitude);
          handleSetPost("lng", longitude);

          document.getElementById("lat").value = latitude;
          document.getElementById("lng").value = longitude;

          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ location: latLng }, function (results, status) {
            if (status === "OK") {
              if (results[0]) {
                for (let i = 0; i < results[0].address_components.length; i++) {
                  const addressType = results[0].address_components[i].types[0];
                  if (addressType === "postal_code") {
                    handleSetPost(
                      "zipCode",
                      results[0].address_components[i].long_name
                    );
                    document.getElementById("zipCode").value =
                      results[0].address_components[i].long_name;
                    break;
                  }
                }

                handleSetPost("area", results[0].formatted_address);
                document.getElementById("area").value =
                  results[0].formatted_address;

                document.getElementById("autocomplete_search").value =
                  results[0].formatted_address;
              } else {
                alert("Postal code not found.");
              }
            } else {
              alert("Geocoder failed due to: " + status);
            }
          });
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="mt-3" id="partnerwrite">
      <h2 className="display-6">업체 등록</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        {/* ID 입력 부분 */}
        <div className="mt-3">
          <label htmlFor="id">
            <h5>id</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="id"
            value={post.userId}
            name="id"

            readOnly
          />
        </div>

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
              />
              <div>
                {errorMessages[fieldName] && (
                  <span className="text-danger">
                    {errorMessages[fieldName]}
                  </span>
                )}
              </div>
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
              <input
                id="autocomplete_search"
                name="autocomplete_search"
                type="text"
                className="form-control"
                placeholder="Search"
              />
              <button onClick={findMyLocation}>
                <GpsFixed />
              </button>
            </div>
            {/* 위도, 경도 입력 */}
            <input
              type="text"
              name="lat"
              id="lat"
              placeholder="lat"
              onChange={handleChange}
            />
            <input
              type="text"
              name="lng"
              id="lng"
              placeholder="lng"
              onChange={handleChange}
            />
            <input
              type="text"
              name="district"
              id="district"
              placeholder="district"
              onChange={handleChange}
            />
            {/* 주소와 우편번호 입력 */}
            <div>
              {errorMessages.area && (
                <span className="text-danger">{errorMessages.area}</span>
              )}
            </div>
            <input
              type="text"
              name="area"
              id="area"
              className="form-control"
              placeholder="Address"
              onChange={handleChange}
            />
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              className="form-control"
              placeholder="zipCode"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 권한 선택 부분 */}
        <div className="mt-3">
          <label htmlFor="job">
            <h5>권한</h5>
          </label>
          <select
            className={`form-select ${post.job ? "has-value" : ""}`}
            name="job"
            id="job"
            onChange={handleChange}
          >
            <option value="">-- 권한을 선택해 주세요 --</option>
            <option value="user">유저</option>
            <option value="user,partner">파트너</option>
          </select>
        </div>

        {/* 하단 버튼 */}
        <div className="d-flex justify-content-end my-3">
          <Form >
            <Form.Control type="hidden" name="user_name" value="부트스트랩" />
            <Form.Control
              type="hidden"
              name="user_email"
              value="imsen4@naver.com"
            />
            <Form.Control
              type="hidden"
              name="to_email"
              value="imsen456@gmail.com"
            />
            <Form.Control
              as="textarea"
              style={{ display: "none" }}
              name="message"
              value="부트스트랩 이게 맞냐 어?"
            />
            <button type="submit" className="button-link" onClick={(e) => { handleSubmit(e) }}>
              작성완료
            </button>
          </Form>

          <Link to="/partnerlist" className="button-link">
            목록
          </Link>
        </div>
        {/* 하단 버튼 */}
      </form>
    </div>
  );
};


export default PartnerWrite;