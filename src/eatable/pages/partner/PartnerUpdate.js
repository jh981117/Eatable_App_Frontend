import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './components/PartnerWrite.css';


const PartnerUpdate = () => {
    const navigate = useNavigate();

    let { id } = useParams();

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
        storeInfo: '',
        tableCnt: '',
        openTime: '',
        reserveInfo: '',
        parking: '',
        corkCharge: '',
        dog: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        favorite: '',
        storeInfo: '',
        tableCnt: '',
        openTime: '',
        reserveInfo: '',
        parking: '',
        corkCharge: '',
        dog: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {

        console.log('=====================================================');
        console.log(post);
        console.log('=====================================================');

    }, [post]);

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

                    // 여기서 주소 정보를 업데이트합니다.
                    setPost(prevState => ({
                        ...prevState,
                        lat: data.address.lat,
                        lng: data.address.lng,
                        area: data.address.area,
                        zipCode: data.address.zipCode
                    }));
                }
            });
    }, []);

    const postUpdate = (e) => {
        e.preventDefault();

        // 초기화
        setErrorMessages({
            favorite: '',
            storeInfo: '',
            tableCnt: '',
            openTime: '',
            reserveInfo: '',
            parking: '',
            corkCharge: '',
            dog: ''
        });

        let hasError = true;

        if (post.favorite.length === 0) {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                favorite: '업종은 반드시 골라야 합니다',
            }));
            hasError = false;
        }

        if (post.storeInfo === null || post.storeInfo === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                storeInfo: '가게 정보는 필수입니다',
            }));
            hasError = false;
        }

        if (post.tableCnt === null || post.tableCnt === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                tableCnt: '테이블 수는 필수입니다',
            }));
            hasError = false;
        }

        if (post.openTime === null || post.openTime === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                openTime: '영업 시간은 필수입니다',
            }));
            hasError = false;
        }

        if (post.reserveInfo === null || post.reserveInfo === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                reserveInfo: '예약 주의 사항은 필수입니다',
            }));
            hasError = false;
        }

        if (post.parking === null || post.parking === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                parking: '주차 정보는 필수입니다',
            }));
            hasError = false;
        }

        if (post.corkCharge === null || post.corkCharge === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                corkCharge: '콜키지 정보는 필수입니다',
            }));
            hasError = false;
        }

        if (post.dog === null || post.dog === '') {
            setErrorMessages((prevErrors) => ({
                ...prevErrors,
                dog: '애완견 정보는 필수입니다',
            }));
            hasError = false;
        }


        if (!hasError) {
            return;
        }

        fetch('http://localhost:8080/api/partner/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(post),
        })
            .then((response) => {
                console.log('response', response);
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((data) => {
                if (data !== null) {
                    navigate(`/partnerdetail/${data.id}`);
                    alert('수정 완료');
                } else {
                    alert('수정 실패');
                }
            });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newFavorites = post.favorite.split(',').filter(food => food.trim() !== '');

        if (checked && newFavorites.length >= 3 && !newFavorites.includes(value)) {
            alert('3개 이상은 체크할 수 없습니다.');
            e.target.checked = false;
            return;
        }

        if (checked) {
            newFavorites.push(value);
        } else {
            newFavorites = newFavorites.filter(food => food !== value);
        }

        setPost(prevState => ({
            ...prevState,
            favorite: newFavorites.join(','),
        }));
    };

    return (
        <div className="mt-3" id='partnerwrite'>
            <h2 className="display-6">업체 등록</h2>
            <hr />
            <form onSubmit={postUpdate}>
                {/* ID 입력 부분 */}
                {/* <div className="mt-3">
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
                </div> */}

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
                            onChange={handleChange}
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
                        <div className="act">
                            {/* <input id="autocomplete_search" name="autocomplete_search" type="text" className="form-control" placeholder="Search" readOnly /> */}
                            {/* <button onClick={findMyLocation}><GpsFixed /></button> */}
                        </div>
                        {/* 위도, 경도 입력 */}
                        <input type="text" name="lat" id="lat" placeholder="lat" onChange={handleChange} value={post.lat} hidden />
                        <input type="text" name="lng" id="lng" placeholder="lng" onChange={handleChange} value={post.lng} hidden />
                        {/* 주소와 우편번호 입력 */}
                        <input type="text" name="area" id="area" className="form-control" placeholder="Address" onChange={handleChange} value={post.area} readOnly />
                        <input type="text" name="zipCode" id="zipCode" className="form-control" placeholder="zipCode" onChange={handleChange} value={post.zipCode} readOnly />
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
                                            onChange={handleCheckboxChange}
                                            checked={post.favorite && post.favorite.includes(food) || ''}
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
                <div>
                    {errorMessages.favorite && (
                        <span className="text-danger">{errorMessages.favorite}</span>
                    )}
                </div>

                {/* 텍스트 입력 */}
                <div className="mt-3">
                    <label htmlFor="storeInfo">
                        <h5>
                            매장소개
                        </h5>
                    </label>
                    <textarea
                        onChange={handleChange}
                        placeholder="매장소개를 입력하세요"
                        id="storeInfo" name="storeInfo" value={post.storeInfo}
                    ></textarea>
                </div>
                <div>
                    {errorMessages.storeInfo && (
                        <span className="text-danger">{errorMessages.storeInfo}</span>
                    )}
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
                        <h5>
                            예약주의사항
                        </h5>
                    </label>
                    <textarea
                        onChange={handleChange}
                        placeholder="여기에 입력하세요"
                        id="reserveInfo" name="reserveInfo" value={post.reserveInfo}
                    ></textarea>
                </div>
                <div>
                    {errorMessages.reserveInfo && (
                        <span className="text-danger">{errorMessages.reserveInfo}</span>
                    )}
                </div>

                {/* radio타입 입력 */}
                <div className="mt-3">
                    {['parking', 'corkCharge', 'dog'].map((item, index) => (
                        <div key={index} className="form-group">
                            <label htmlFor={`${item}Radio`}>
                                {item === 'corkCharge' ? '콜키지' : item === 'dog' ? '애완견' : '주차정보'}
                            </label>
                            <div className="d-flex">
                                <div className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={item}
                                        id={`${item}Available`}
                                        value="TRUE"
                                        onChange={handleChange}
                                        checked={post[item] === 'TRUE'}
                                        style={{ marginRight: '5px' }}
                                    />
                                    <label className="form-check-label" htmlFor={`${item}Available`} style={{ marginRight: '10px' }}>
                                        가능
                                    </label>
                                </div>
                                <div className="form-check" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={item}
                                        id={`${item}NotAvailable`}
                                        value="FALSE"
                                        onChange={handleChange}
                                        checked={post[item] === 'FALSE'}
                                        style={{ marginRight: '5px' }}
                                    />
                                    <label className="form-check-label" htmlFor={`${item}NotAvailable`} >
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

                {/* 권한 선택 부분 */}
                {/* <div className="mt-3">
                        <label htmlFor="job">
                        <h5>권한</h5>
                        </label>
                        <select
                        className={`form-select ${post.job ? 'has-value' : ''}`}
                        name="job"
                        id="job"
                        onChange={handleChange}
                        // value={'post.job'}
                        >
                        <option value="">
                        -- 권한을 선택해 주세요 --
                        </option>
                        <option value="user">유저</option>
                        <option value="user,partner">파트너</option>
                        </select>
                    </div> */}




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
                        이전으로
                    </button>

                    <Link className="button-link" to="/partnerlist">
                        목록
                    </Link>

                </div>
            </form>
            {/* 하단 버튼 */}
        </div >
    );
};

export default PartnerUpdate;
