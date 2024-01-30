import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './components/PartnerWrite.css';
import './components/Autocomplete.css'
import { GpsFixed } from '@material-ui/icons';
import Autocomplete from './components/Autocomplete';


const PartnerWrite = () => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    storeName: '',
    partnerName: '',
    partnerPhone: '',
    storePhone: '',
    favorite: '',
    lat: '',
    lng: '',
    area: '',
    zipCode: '',
  });

  console.log(post);
  const setValue = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {

    console.log('=====================================================');
    console.log(post);
    console.log('=====================================================');

  }, [post]);


  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    const selectedFavorites = post.favorite.split(',').filter((item) => item.trim() !== '');

    if (selectedFavorites.length >= 3 && !selectedFavorites.includes(value)) {
      // If the maximum number of checkboxes (3) is already selected and the current checkbox is not in the selected list
      alert('3개이상은 체크할수 없습니다.');
      e.target.checked = false;
    } else {
      // Toggle checkbox selection
      if (post.favorite.includes(value)) {
        // If already selected, remove from the list
        setPost({
          ...post,
          favorite: selectedFavorites.filter((item) => item !== value).join(','),
        });
      } else {
        // If not selected, add to the list
        setPost({
          ...post,
          favorite: post.favorite ? `${post.favorite},${value}` : value,
        });
      }
    }
  };

  const Save = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/partner/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
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
          // navigate("/");
          navigate(`/partnerdetail/${data.id}`);
        } else {
          alert('제출실패');
        }
      });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initialize();
    };

    return () => {
      document.body.removeChild(script);
    };

  }, []);

  const initialize = () => {
    const input = document.getElementById('autocomplete_search');
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      console.log(place);
      if (!place.geometry || !place.geometry.location) {
        // 장소가 없을 때 가장 근접한 검색어로 입력
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: input.value }, function (predictions, status) {
          if (status === 'OK' && predictions) {
            // 근접한 검색어의 주소, 우편번호, 좌표 입력
            const placeService = new window.google.maps.places.PlacesService(document.createElement('div'));
            placeService.getDetails({ placeId: predictions[0].place_id }, function (placeDetails, placeStatus) {
              if (placeStatus === 'OK') {
                document.getElementById('lat').value = placeDetails.geometry.location.lat();
                document.getElementById('lng').value = placeDetails.geometry.location.lng();
                document.getElementById('area').value = placeDetails.formatted_address;

                // 주소의 우편번호 가져오기
                for (let i = 0; i < placeDetails.address_components.length; i++) {
                  const addressType = placeDetails.address_components[i].types[0];
                  if (addressType === 'postal_code') {
                    document.getElementById('zipCode').value = placeDetails.address_components[i].long_name;
                    setPost(prevState => ({
                      ...prevState,
                      zipCode: placeDetails.address_components[i].long_name
                    }));
                    break;
                  }
                }
              } else {
                alert('근접한 장소의 세부 정보를 가져올 수 없습니다.');
              }
            });
          }
        });
        return;
      }
      // document.getElementById('lat').value = place.geometry.location.lat();

      setPost(prevState => ({
        ...prevState,
        lat: place.geometry.location.lat()
      }));

      // document.getElementById('lng').value = place.geometry.location.lng();
      setPost(prevState => ({
        ...prevState,
        lng: place.geometry.location.lng()
      }));

      document.getElementById('area').value = place.formatted_address;
      setPost(prevState => ({
        ...prevState,
        area: place.formatted_address
      }));

      // 좌표를 사용하여 우편번호 가져오기
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 'location': place.geometry.location }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            for (let i = 0; i < results[0].address_components.length; i++) {
              const addressType = results[0].address_components[i].types[0];
              if (addressType === 'postal_code') {
                // document.getElementById('zipCode').value = results[0].address_components[i].long_name;
                setPost(prevState => ({
                  ...prevState,
                  zipCode: results[0].address_components[i].long_name
                }));
                break;
              }
            }
          } else {
            alert('우편번호를 찾을 수 없습니다.');
          }
        } else {
          alert('Geocoder에 문제가 발생했습니다.');
        }
      });
      // document.getElementById('area').value = place.formatted_address;
      setPost(prevState => ({
        ...prevState,
        area: place.formatted_address
      }));
    });

    // 입력창에 키가 눌릴 때마다 자동완성된 검색어 저장
    input.addEventListener('input', function () {
      input.setAttribute('data-autocompleted-value', input.value);
    });
  };

  const findMyLocation = (event) => {
    event.preventDefault(); // 현재 위치 버튼 클릭 시 폼 제출 방지

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;


          // document.getElementById('lat').value = latitude;
          setPost(prevState => ({
            ...prevState,
            lat: latitude
          }));

          // document.getElementById('lng').value = longitude;
          setPost(prevState => ({
            ...prevState,
            lng: longitude
          }));

          const geocoder = new window.google.maps.Geocoder();
          const latLng = new window.google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ 'location': latLng }, function (results, status) {
            if (status === 'OK') {
              if (results[0]) {
                for (let i = 0; i < results[0].address_components.length; i++) {
                  const addressType = results[0].address_components[i].types[0];
                  if (addressType === 'postal_code') {
                    document.getElementById('zipCode').value = results[0].address_components[i].long_name;
                    setPost(prevState => ({
                      ...prevState,
                      zipCode: results[0].address_components[i].long_name
                    }));
                    break;
                  }
                }
                document.getElementById('area').value = results[0].formatted_address;
                setPost(prevState => ({
                  ...prevState,
                  area: results[0].formatted_address
                }));

                // Set search input value to the formatted address
                document.getElementById('autocomplete_search').value = results[0].formatted_address;
              } else {
                alert('Postal code not found.');
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
        },
        () => {
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="display-6">업체 등록</h2>
      <hr />
      <form onSubmit={Save}>
        <div className="mt-3">
          <label htmlFor="id">
            <h5>id</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="id"
            placeholder=""
            name="id"
            value={'id 입력예정'}
            readOnly
          />
        </div>

        <div className="mt-3">
          <label htmlFor="storeName">
            <h5>매장이름</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="storeName"
            placeholder="이름을 입력하세요"
            name="storeName"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="partnerName">
            <h5>관리자이름</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="partnerName"
            placeholder="이름을 입력하세요"
            name="partnerName"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="partnerPhone">
            <h5>관리자 전화번호</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="partnerPhone"
            placeholder="전화번호를 입력하세요   ex) 01042364123"
            name="partnerPhone"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="storePhone">
            <h5>매장 전화번호</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="storePhone"
            placeholder="전화번호를 입력하세요   ex) 0242364123"
            name="storePhone"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="adress">
            <h5>매장주소</h5>
          </label>
          <div>
            <div className="act">
              <input id="autocomplete_search" name="autocomplete_search" type="text" className="form-control" placeholder="Search" />
              <button onClick={findMyLocation}><GpsFixed /></button>
            </div>
            <input type="text" name="lat" id="lat" placeholder="lat" />
            <input type="text" name="lng" id="lng" placeholder="lng" />

            {/* 주소 입력 input */}
            <input type="text" name="area" id="area" className="form-control" placeholder="Address" readOnly />
            {/* 우편번호 입력 input */}
            <input type="text" name="zipCode" id="zipCode" className="form-control" placeholder="zipCode" readOnly />
          </div>
        </div>

        <div className="mt-3">
          <label>
            <h5>
              업종 <small>(1개이상 선택)</small>
            </h5>
          </label>

          <div className="row">
            {/* Group 1 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="한식"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite1">
                  한식
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="중식"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite2">
                  중식
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="일식"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  일식
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 2 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="이탈리아"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  이탈리아
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="프랑스"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  프랑스
                </label>
              </div>
            </div>


            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="유러피안"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  유러피안
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 3 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="퓨전"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  퓨전
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="스페인"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  스페인
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="아메리칸"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  아메리칸
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 4 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="스시"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  스시
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="한우"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  한우
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="소고기구이"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  소고기구이
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 5 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="와인"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  와인
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="코스요리"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  코스요리
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="고기요리"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  고기요리
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 6 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="한정식"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  한정식
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="파스타"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  파스타
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="해물"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  해물
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 7 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="다이닝바"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  다이닝바
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="브런치"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  브런치
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="카페"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  카페
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 8 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="치킨"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  치킨
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="레스토랑"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  레스토랑
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="피자"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  피자
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Group 8 */}
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="백반"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  백반
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="국수"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  국수
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="비건"
                  name="favorite"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="favorite3">
                  비건
                </label>
              </div>
            </div>
          </div>


        </div>


        <div className="mt-3">
          <label htmlFor="job">
            <h5>권한</h5>
          </label>
          <select
            className={`form-select ${post.job ? 'has-value' : ''}`}
            name="job"
            id="job"
            onChange={setValue}
          >
            <option value="">
              -- 권한을 선택해 주세요 --
            </option>
            <option value="user">유저</option>
            <option value="user,partner">파트너</option>
          </select>
        </div>

        {/* 하단 버튼 */}
        <div className="d-flex justify-content-end my-3">
          <button type="submit" className="button-link">
            작성완료
          </button>
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
