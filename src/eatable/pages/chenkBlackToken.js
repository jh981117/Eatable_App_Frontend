const BlackToken = async (token) => {
  try {
    const response = await fetch("http://localhost:8080/api/black", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blackToken: token }), // Corrected to match the expected structure
    });
    const data = await response.json();
    console.log(data, "1111111111111111111111111111111"); // 서버 응답 확인을 위한 로그
    return data;
  } catch (error) {
    console.error("Error checking black token:", error);
    return null;
  }
};

export default BlackToken;
