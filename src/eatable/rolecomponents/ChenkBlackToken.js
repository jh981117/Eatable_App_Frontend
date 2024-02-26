const checkBlackToken = (token) => {
  try {
    const response =  fetch("http://api/black", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blackToken: token }),
    });
    const data =  response.json();
    return data; // 백엔드에서 1 또는 0을 반환한다고 가정
  } catch (error) {
    console.error("Error checking black token:", error);
    return null;
  }
};
