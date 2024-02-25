import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MenuListCRUD = ({ id }) => {
  const [menus, setMenus] = useState([]); // 메뉴 데이터를 상태로 관리
  const [updatedMenu, setUpdatedMenu] = useState({
    name: "",
    price: "",
    imageURL: "",
  }); // 수정된 메뉴 정보 상태
  const [editMenuId, setEditMenuId] = useState(null); // 수정 중인 메뉴의 ID를 저장하는 상태

  const [newMenu, setNewMenu] = useState({ name: "", price: "" });
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(
    "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708524569966-123.png"
  );

  /////////////  데이터 가져오기 //////////////////

  // 메뉴 데이터를 가져오는 함수
  const fetchMenus = () => {
    fetch(`http://localhost:8080/api/partner/partnerMenuList/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMenus(data);
      })
      .catch((error) => console.error("메뉴블러오기 실패:", error));
  };

  // 컴포넌트 마운트 시 메뉴 데이터 가져오기
  useEffect(() => {
    fetchMenus();
  }, [id]); // id가 변경될 때마다 다시 데이터를 가져옵니다.

  /////////////  데이터 가져오기 //////////////////

  //////////////// 메뉴 등록하기 /////////////////////////
  // 새로운 메뉴 추가 핸들러

  const handleAddMenu = () => {
    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("price", newMenu.price);
    if (fileInputRef.current.files[0]) {
      formData.append("file", fileInputRef.current.files[0]);
    }

    fetch(`http://localhost:8080/api/partner/addMenu/${id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("메뉴가 추가되었습니다.");
          // 메뉴 추가 후 상태 초기화
          setNewMenu({ name: "", price: "" });
          setPreviewImage(
            "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708524569966-123.png"
          );
          // 여기서 fetchMenus 함수를 호출하여 메뉴 리스트를 최신화
          fetchMenus();
        } else {
          alert("메뉴 추가에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("메뉴 추가에 실패했습니다.");
      });
  };

  // 새로운 메뉴 입력값 변경 핸들러
  const handleNewMenuChange = (e) => {
    const { name, value } = e.target;
    setNewMenu({ ...newMenu, [name]: value });
  };

  // 파일 변경 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  //////////////// 메뉴 등록하기 /////////////////////////

  const handleDeleteMenu = (menuId) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }
    fetch(`http://localhost:8080/api/partner/deleteMenu/${menuId}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "Menu deleted successfully") {
          alert("삭제성공");
          setMenus((prevMenus) =>
            prevMenus.filter((menu) => menu.id !== menuId)
          );
        } else {
          alert("삭제실패");
        }
      });
    console.log(`Deleting menu with id ${menuId}`);
  };

  const handleStartEdit = (menuId) => {
    setEditMenuId(menuId);
  };

  const handleEditMenu = (menuId, updatedMenu) => {
    console.log(updatedMenu); // 수정된 메뉴 정보 확인
    fetch(`http://localhost:8080/api/partner/updateMenu/${id}/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: updatedMenu.name,
        price: updatedMenu.price,
        menuImageUrl: updatedMenu.imageURL, // imageURL를 menuImageUrl로 수정
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // 성공적으로 수정된 경우 처리
          console.log("메뉴가 수정되었습니다.", data);
          // 상태를 업데이트하여 화면을 다시 렌더링
          setMenus((prevMenus) =>
            prevMenus.map((menu) => (menu.id === menuId ? data : menu))
          );
          setEditMenuId(null); // 수정 중인 메뉴 ID 초기화
        } else {
          // 수정 실패 시 처리
          console.log("메뉴 수정에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // 오류 발생 시 처리
        console.log("메뉴 수정에 실패했습니다.");
      });
  };

  const handleUpdatedMenuChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMenu((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>사진</th>
          <th style={tableHeaderStyle}>이름</th>
          <th style={tableHeaderStyle}>가격</th>
          <th style={tableHeaderStyle}></th> {/* 수정, 삭제 버튼 추가 */}
        </tr>
      </thead>
      <tbody>
        {menus.map((menu) => (
          <Menu
            key={menu.id}
            menuImageUrl={
              menu.menuImageUrl
                ? menu.menuImageUrl
                : "https://eatablebucket.s3.ap-northeast-2.amazonaws.com/1708524569966-123.png"
            }
            name={menu.name}
            price={menu.price}
            handleDelete={() =>
              handleDeleteMenu(menu.id)
            } /* 삭제 버튼 클릭 핸들러 */
            handleStartEdit={() =>
              handleStartEdit(menu.id)
            } /* 수정 버튼 클릭 핸들러 */
            isEditing={editMenuId === menu.id} // 수정 중인지 여부를 확인하는 프로퍼티
            handleEditMenu={handleEditMenu} // 메뉴 수정 핸들러 함수 전달
            handleUpdatedMenuChange={handleUpdatedMenuChange} // 수정된 메뉴 정보 변경 핸들러 전달
            updatedMenu={updatedMenu} // 수정된 메뉴 정보 상태 전달
            menu={menu} // menu 객체 전달
          />
        ))}
        {/* 새로운 메뉴 입력 폼 */}
        <tr>
          <td style={tableCellStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <img
                src={previewImage}
                alt="Upload Preview"
                onClick={handleImageClick}
                style={{ cursor: "pointer", width: "70px", height: "70px" }}
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </td>
          <td style={tableCellStyle}>
            <Form.Control
              type="text"
              name="name"
              value={newMenu.name}
              onChange={handleNewMenuChange}
              placeholder="이름"
            />
          </td>
          <td style={tableCellStyle}>
            <Form.Control
              type="text"
              name="price"
              value={newMenu.price}
              onChange={handleNewMenuChange}
              placeholder="가격"
            />
          </td>
          <td style={tableCellStyle}>
            <Button onClick={handleAddMenu}>추가</Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Menu = ({
  menuImageUrl,
  name,
  price,
  handleStartEdit,
  handleDelete,
  isEditing,
  handleEditMenu,
  handleUpdatedMenuChange,
  updatedMenu,
  menu,
}) => {
  return (
    <tr style={tableRowStyle}>
      <td style={tableCellStyle}>
        {isEditing ? (
          <Form.Control
            type="text"
            name="menuImageUrl"
            defaultValue={menuImageUrl}
            onChange={handleUpdatedMenuChange}
          />
        ) : (
          <img src={menuImageUrl} style={{ width: "100px" }} alt="menu" />
        )}
      </td>
      <td style={tableCellStyle}>
        {isEditing ? (
          <Form.Control
            type="text"
            name="name"
            defaultValue={name}
            onChange={handleUpdatedMenuChange}
          />
        ) : (
          <span>{name}</span>
        )}
      </td>
      <td style={tableCellStyle}>
        {isEditing ? (
          <Form.Control
            type="text"
            name="price"
            defaultValue={price}
            onChange={handleUpdatedMenuChange}
          />
        ) : (
          <span>{price}원</span>
        )}
      </td>
      <td style={tableCellStyle}>
        {isEditing ? (
          <Button onClick={() => handleEditMenu(menu.id, updatedMenu)}>
            수정 완료
          </Button>
        ) : (
          <Button onClick={handleStartEdit}>수정</Button>
        )}
        <Button onClick={handleDelete}>삭제</Button>
      </td>
    </tr>
  );
};

const tableHeaderStyle = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  
};

export default MenuListCRUD;
