import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PartnerWrite.css';
import Autocomplete from './components/Autocomplete';


const PartnerWrite = () => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    name: '',
    menu: '',
    phone: '',
    tableCnt: '',
    job: '',
    favorite: '',
  });

  console.log(post);
  const setValue = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

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
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Here, you can add logic to submit your form data, for example, sending it to an API

    // After successful submission, navigate to the partner list page
    navigate('/partnerlist');
  };

  return (
    <div className="container mt-3">
      <h2 className="display-6">업체 등록</h2>
      <hr />
      <form >
        <div className="mt-3">
          <label htmlFor="menu">
            <h5>id</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="id"
            placeholder=""
            name="id"
            onChange={setValue}
            value={'id 입력예정'}
            readOnly
          />
        </div>

        <div className="mt-3">
          <label htmlFor="name">
            <h5>매장이름</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="이름을 입력하세요"
            name="name"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="name">
            <h5>관리자이름</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="이름을 입력하세요"
            name="name"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="phone">
            <h5>관리자 전화번호</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            placeholder="전화번호를 입력하세요   ex) 01042364123"
            name="phone"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
          <label htmlFor="phone">
            <h5>매장 전화번호</h5>
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            placeholder="전화번호를 입력하세요   ex) 0242364123"
            name="phone"
            onChange={setValue}
          />
        </div>

        <div className="mt-3">
        <label htmlFor="adress">
            <h5>매장주소</h5>
          </label>
          <Autocomplete/>
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
