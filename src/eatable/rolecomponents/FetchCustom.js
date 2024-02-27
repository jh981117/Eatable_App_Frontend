// API.js
async function fetchWithToken(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // 액세스 토큰 가져오기

  // 토큰 디코드 시도
  try {
  } catch (error) {
    console.error("Token decode failed:", error);
    // 토큰 디코드 실패 처리 로직 (예: 로그아웃)
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // 액세스 토큰이 만료된 경우
  if (response.status === 401) {
    const refreshResponse = await fetch(
      "http://localhost:8080/api/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`, // AccessToken을 Bearer 토큰으로 추가
        },
      }
    );

    if (refreshResponse.ok) {
      const token = await refreshResponse.json();
      localStorage.setItem("token", token); // 새로운 토큰 저장
      console.log(token , "123123123");
      // 요청을 재시도
      return fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // 새 토큰을 받아오지 못한 경우, 로그아웃 처리 등의 로직을 추가할 수 있습니다.
      console.error("Unable to refresh token");
      // 로그아웃 처리
    }
  }

  return response;
}

export default fetchWithToken;
