// components/MenuList.js

import React from 'react';

const MenuList = ({ menuData }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={tableHeaderStyle}>이름</th>
                    <th style={tableHeaderStyle}>가격</th>
                </tr>
            </thead>
            <tbody>
                {menuData.map((menu, index) => (
                    <Menu key={index} name={menu.name} price={menu.price} />
                ))}
            </tbody>
        </table>
    );
};

const Menu = ({ name, price }) => {
    return (
        <tr style={tableRowStyle}>
            <td style={tableCellStyle}>{name}</td>
            <td style={tableCellStyle}>{price}원</td>
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

export default MenuList;