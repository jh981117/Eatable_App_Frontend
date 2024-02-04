import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const PartnerDetail = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  const [post, setPost] = useState({});

  const favoriteGroups = [
    ['한식', '중식', '일식'],
    ['이탈리아', '프랑스', '유러피안'],
    ['퓨전', '스페인', '아메리칸'],
    ['스시', '한우', '소고기구이'],
    ['와인', '코스요리', '고기요리'],
    ['한정식', '파스타', '해물'],
    ['다이닝바', '브런치', '카페'],
    ['치킨', '레스토랑', '피자'],
    ['백반', '국수', '비건']
  ];

  useEffect(() => {
    fetch('http://localhost:8080/api/partner/detail/' + id)
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

        }
      });
  }, []);

  const deletePost = () => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    fetch('http://localhost:8080/api/partner/delete/' + id, {
      method: 'DELETE',
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "1") {
          alert('삭제되었습니다');
          navigate('/partnerlist');
        } else {
          alert('삭제 실패');
        }
      });
  };

  const updatePost = () => {
    navigate('/partnerupdate/' + id);
  };

  return (
    <div className="mt-3" id='partnerwrite'>
      <h2 className="display-6">업체 등록</h2>
      <hr />
      {/* ID 입력 부분 */}
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

      {/* 나머지 입력 부분들 */}
      {['storeName', 'partnerName', 'partnerPhone', 'storePhone'].map((fieldName, index) => (
        <div key={index} className="mt-3">
          <label htmlFor={fieldName}>
            <h5>{fieldName === 'storeName' ? '매장이름' : fieldName === 'partnerName' ? '관리자이름' : fieldName === 'partnerPhone' ? '관리자 전화번호' : '매장 전화번호'}</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id={fieldName}
            placeholder={fieldName === 'partnerPhone' ? '전화번호를 입력하세요   ex) 01042364123' : fieldName === 'storePhone' ? '전화번호를 입력하세요   ex) 0242364123' : '이름을 입력하세요'}
            name={fieldName}
            value={post[fieldName] || ''}
            readOnly
          />
        </div>
      ))}

      {/* 매장주소 입력 부분 */}
      <div className="mt-3">
        <label htmlFor="address">
          <h5>매장주소</h5>
        </label>
        <div>
          <input
            type="text"
            name="area"
            id="area"
            className="form-control"
            placeholder="Address"
            value={post.address?.area || ''}
            readOnly
          />
          <input
            type="text"
            name="zipCode"
            id="zipCode"
            className="form-control"
            placeholder="zipCode"
            readOnly
            value={post.address?.zipCode || ''}
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
        {favoriteGroups.map((group, index) => (
          <div key={index} className="row">
            {group.map((food, i) => (
              <div key={i} className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={food}
                    name="favorite"
                    checked={post.favorite && post.favorite.includes(food) || ''}
                    readOnly
                  />
                  <label className="form-check-label" htmlFor={`favorite${index}${i}`}>
                    {food}
                  </label>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 텍스트 입력 */}
      <div className="mt-3">
        <label htmlFor="storeInfo">
          <h5>
            매장소개
          </h5>
        </label>
        <textarea
          placeholder="여기에 입력하세요"
          id="storeInfo" name="storeInfo" value={post.storeInfo} readOnly
        ></textarea>
      </div>

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
          value={post.tableCnt} readOnly
        />
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
          value={post.openTime}
          readOnly
        />
      </div>

      {/* 텍스트 입력 */}
      <div className="mt-3">
        <label htmlFor="reserveInfo">
          <h5>
            예약주의사항
          </h5>
        </label>
        <textarea
          placeholder="여기에 입력하세요"
          id="reserveInfo" name="reserveInfo" value={post.reserveInfo} readOnly
        ></textarea>
      </div>

      {/* radio타입 입력 */}
      <div className="mt-3">
        {['parking', 'corkCharge', 'dog'].map((item, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`${item}Available`}>
              {item === 'corkCharge' ? '콜키지' : item === 'dog' ? '애완견' : '주차정보'}
            </label>
            <div className="d-flex flex-row ">
              <div className="form-check mr-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name={item}
                  id={`${item}Available`}
                  value="TRUE"
                  checked={post[item] === 'TRUE'}
                />
                <label className="form-check-label" htmlFor={`${item}Available`}>
                  가능
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={item}
                  id={`${item}NotAvailable`}
                  value="FALSE"
                  checked={post[item] === 'FALSE'}
                />
                <label className="form-check-label" htmlFor={`${item}NotAvailable`}>
                  불가능
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* 권한 선택 부분
      <div className="mt-3">
        <label htmlFor="job">
          <h5>권한</h5>
        </label>
        <input
          type="text"
          className="form-control"
          id="job"
          placeholder=""
          name="job"
          value={'권한 입력예정'}
          readOnly
        />
      </div> */}

      {/* 하단 링크 */}
      <div className="d-flex justify-content-end my-3">
        <Button className="button-link" onClick={updatePost}>
          수정
        </Button>
        <Link className="button-link" to="/partnerlist">
          목록
        </Link>
        <Button
          variant="none"
          className="button-link" onClick={deletePost}
        >
          삭제
        </Button>
        <Link className="button-link" to="/partnerwrite">
          작성
        </Link>
      </div>
      {/* 하단 링크 */}
    </div>
  );
};

export default PartnerDetail;
