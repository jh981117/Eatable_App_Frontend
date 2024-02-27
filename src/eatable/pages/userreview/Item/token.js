const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  const response = await fetch("http://your-api-domain.com/api/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } else {
    throw new Error("Failed to refresh token");
  }
};

export const fetchWithToken = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Access Token expired
    accessToken = await refreshToken();
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
};
