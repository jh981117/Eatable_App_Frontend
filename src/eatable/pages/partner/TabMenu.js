import React, { useState } from 'react';

const TabMenu = ({ setInputValue }) => {
    const [selectedTab, setSelectedTab] = useState("districts");

    const districts = [
        "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구",
        "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구",
        "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"
    ];

    const products = [
        "족발.보쌈", "돈까스", "고기.구이", "피자", "찜.탕.찌개", "양식", "중식", "아시안", "치킨", "한식", "버거", "분식"
    ];


    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setInputValue("");
        document.getElementById("districts-select").value = "";
        document.getElementById("favorite-select").value = "";
    };

    return (
        <>
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" >
                        <a
                            className={`nav-link ${selectedTab === "districts" ? "active" : ""}`}
                            id="districts-tab"
                            data-toggle="tab"
                            href="#districts"
                            role="tab"
                            aria-controls="districts"
                            aria-selected={selectedTab === "districts"}
                            onClick={() => handleTabChange("districts")}
                        >
                            지역
                        </a>
                    </li>
                    <li className="nav-item" >
                        <a
                            className={`nav-link ${selectedTab === "products" ? "active" : ""}`}
                            id="products-tab"
                            data-toggle="tab"
                            href="#products"
                            role="tab"
                            aria-controls="products"
                            aria-selected={selectedTab === "products"}
                            onClick={() => handleTabChange("products")}
                        >
                            업종
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div
                        className={`tab-pane fade show ${selectedTab === "districts" ? "active" : ""}`}
                        id="districts"
                        role="tabpanel"
                        aria-labelledby="districts-tab"
                    >
                        <select onChange={(e) => setInputValue(e.target.value)} id="districts-select">
                            <option value="" >지역을 선택하세요</option>
                            {districts.map((district, index) => (
                                <option key={index} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                    <div
                        className={`tab-pane fade ${selectedTab === "products" ? "show active" : ""}`}
                        id="products"
                        role="tabpanel"
                        aria-labelledby="products-tab"
                    >
                        <select onChange={(e) => setInputValue(e.target.value)} id="favorite-select">
                            <option value="">업종을 선택하세요</option>
                            {products.map((product, index) => (
                                <option key={index} value={product}>{product}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TabMenu;
