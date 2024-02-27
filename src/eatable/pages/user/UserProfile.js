// hooks/useUserProfile.js
import { useState, useEffect } from "react";
import fetchWithToken from "../rolecomponents/FetchCustom";

const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetchWithToken(
        "http://localhost:8080/api/user/profile"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      setError(error.toString());
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, setProfile, error, fetchProfile }; // fetchProfile 함수를 반환값에 추가
};

export default useUserProfile;
