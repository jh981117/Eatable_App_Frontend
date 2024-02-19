import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MenuListCRUD = ({ menuData, handleEditMenu, id }) => {
    const [menus, setMenus] = useState(menuData); // 메뉴 데이터를 상태로 관리
    

    useEffect(() => {
        setMenus(menuData); // menuData를 상태로 설정
    }, [menuData]);
    console.log('id:'+ id)
    console.log('메뉴데이터'+menus)
    const handleDeleteMenu = (menuId) => {
        console.log(menuId + " 삭제할 메뉴 아이디")
        // 확인 대화상자를 표시하여 사용자에게 삭제 여부 확인
        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (!isConfirmed) {
            return; // 사용자가 취소한 경우 함수 종료
        }
        // 여기에 삭제 로직을 구현합니다.
        fetch(`http://localhost:8080/api/partner/deleteMenu/${id}/${menuId}`, {
            method: "DELETE",
        }).then(response => response.text())
        .then(data=>{ 
            console.log('데이터'+data)
            if(data === 'Menu deleted successfully'){
                alert("삭제성공");
                // 상태에서 삭제된 메뉴를 제외하고 업데이트
                setMenus(prevMenus => prevMenus.filter(menu => menu.id !== menuId));
            }else{
                alert("삭제실패")
            }
        })
        console.log(`Deleting menu with id ${menuId}`);
    };

    const handleEdit = (menuId) => {
        // 여기에 수정 로직을 구현합니다.
        console.log(`Editing menu with id ${menuId}`);
        // 수정할 항목에 대한 처리를 수행할 수 있습니다.
    };
    console.log(menuData+'menuData')
  

  

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={tableHeaderStyle}>사진</th>
                    <th style={tableHeaderStyle}>이름</th>
                    <th style={tableHeaderStyle}>가격</th>
                    <th style={tableHeaderStyle}>작업</th> {/* 수정, 삭제 버튼 추가 */}
                    <Button>메뉴 추가</Button>
                </tr>
            </thead>
            <tbody>
                {menus.map((menu) => (
                    <Menu
                        key={menu.id}
                        menuImageUrl={menu.menuImageUrl}
                        name={menu.name}
                        price={menu.price}
                        handleEdit={() => handleEdit(menu.id)} /* 수정 버튼 클릭 핸들러 */
                        handleDelete={() => handleDeleteMenu(menu.id)} /* 삭제 버튼 클릭 핸들러 */
                    />
                ))}
            </tbody>
        </table>
    );
};

const Menu = ({ menuImageUrl, name, price, handleEdit, handleDelete }) => {
    return (
        <tr style={tableRowStyle}>
            <td style={tableCellStyle}><img src={menuImageUrl} style={{width: "100px"}} alt="menu"/></td>
            <td style={tableCellStyle}>{name}</td>
            <td style={tableCellStyle}>{price}원</td>
            <td style={tableCellStyle}>
                <button onClick={handleEdit}>수정</button> {/* 수정 버튼 */}
                <button onClick={handleDelete}>삭제</button> {/* 삭제 버튼 */}
            </td>
        </tr>
    );
};

const tableHeaderStyle = {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
};

const tableRowStyle = {
    borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
    padding: '10px',
};

export default MenuListCRUD;
