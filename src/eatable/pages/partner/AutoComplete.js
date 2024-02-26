import React, { useEffect, useState } from 'react';
import './components/AutoComplete.css';

const AutoComplete = ({ onAutoCompleteData }) => {

    const [inputValue, setInputValue] = useState("");
    const [isHaveInputValue, setIsHaveInputValue] = useState(false);
    const [dropDownList, setDropDownList] = useState([]);
    const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);
    const [wholeTextArray, setWholeTextArray] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/partner/search?keyword=${inputValue}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then((data) => {
                if (data !== null) {
                    // console.log(data.content);
                    setWholeTextArray(data.content);
                    updateDropDownList(data.content);
                }
            })
            .catch((error) => console.error("Error fetching search results:", error));
    }, [inputValue]);

    const updateDropDownList = (data) => {
        if (inputValue === '') {
            setIsHaveInputValue(false);
            setDropDownList([]);
        } else {
            const filteredList = [];

            data.forEach(item => {
                if (item.storeName.includes(inputValue) && !filteredList.includes(item.storeName)) {
                    filteredList.push(item.storeName);
                }
                if (item.favorite.includes(inputValue) && !filteredList.includes(item.favorite)) {
                    filteredList.push(item.favorite);
                }
                if (item.address.area.includes(inputValue) && !filteredList.includes(item.address.area)) {
                    filteredList.push(item.address.area);
                }
            });
            setDropDownList(filteredList);
            setIsHaveInputValue(true);
            
        }
    };


    const changeInputValue = event => {
        setInputValue(event.target.value);
        setIsHaveInputValue(true);
    };

    const clickDropDownItem = clickedItem => {
        setInputValue(clickedItem);
        onAutoCompleteData(clickedItem);
        setIsHaveInputValue(false);
    };

    const handleEnterKey = () => {
        if (dropDownItemIndex >= 0) {
            clickDropDownItem(dropDownList[dropDownItemIndex]);
            setDropDownItemIndex(-1);
        } else {
            setIsHaveInputValue(false);
            onAutoCompleteData(inputValue);
        }
    };
    
    const handleDropDownKey = event => {
        if (isHaveInputValue) {
            if (event.key === 'ArrowDown' && dropDownList.length - 1 > dropDownItemIndex) {
                setDropDownItemIndex(dropDownItemIndex + 1);
            }
            if (event.key === 'ArrowUp' && dropDownItemIndex >= 0) {
                setDropDownItemIndex(dropDownItemIndex - 1);
            }
            if (event.key === 'Enter') {
                handleEnterKey();
            }
        }
    };
    

    useEffect(() => {
        updateDropDownList(wholeTextArray);
    }, [wholeTextArray]);

    return (
        <div className="whole-box">
            <div className={`input-box ${isHaveInputValue ? 'active' : ''}`}>
                <input
                    type='text'
                    value={inputValue}
                    onChange={changeInputValue}
                    onKeyUp={handleDropDownKey}
                    className="input3"
                />
                <div className="delete-button" onClick={() => setInputValue('')}>&times;</div>
            </div>
            {isHaveInputValue && (
                <ul className="drop-down-box">
                    {dropDownList.length === 0 && (
                        <li className="drop-down-item">해당하는 단어가 없습니다</li>
                    )}
                    {dropDownList.map((dropDownItem, dropDownIndex) => {
                        return (
                            <li
                                key={dropDownIndex}
                                onClick={() => clickDropDownItem(dropDownItem)}
                                onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                                className={`drop-down-item ${dropDownItemIndex === dropDownIndex ? 'selected' : ''}`}
                            >
                                {dropDownItem}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;