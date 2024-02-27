import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: !!localStorage.getItem("token"), // 토큰 유무에 따른 로그인 상태 초기화
    user: null,
    profile: null,
    token: localStorage.getItem("token"), // 토큰을 상태로 관리
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 토큰이 있으면 프로필 업데이트
    const token = localStorage.getItem("token");
    if (token) {
      updateProfile();
    }
  }, []);

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

   // 로컬 스토리지의 토큰 변경을 감지하고 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setAuth((prevAuth) => ({
        ...prevAuth,
        isLoggedIn: !!newToken,
        token: newToken,
      }));
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
