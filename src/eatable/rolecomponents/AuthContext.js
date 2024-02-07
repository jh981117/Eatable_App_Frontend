import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 로컬 스토리지에서 로그인 상태를 읽어와 초기 상태로 설정하는 로직을 개선
 const [auth, setAuth] = useState({
   isLoggedIn: false,
   user: null,
   profile: null,
 });
  // useEffect(() => {
  //   // auth 상태가 변경될 때마다 로컬 스토리지에 저장
  //   localStorage.setItem("auth", JSON.stringify(auth));
  // }, [auth]);

  // 프로필 정보를 업데이트하는 함수 추가
  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const profileData = await response.json();
        setAuth((prevAuth) => ({
          ...prevAuth,
          profile: profileData,
        }));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
