import axios from "axios";

const http = axios.create({
  baseURL: "https://api.tif.uin-suska.ac.id/setoran-dev/v1",
});

// REQUEST
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const res = await axios.post(
          "https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token",
          new URLSearchParams({
            client_id: "setoran-mobile-dev",
            client_secret: "aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl",
            grant_type: "refresh_token",
            refresh_token: refreshToken
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );

        const newToken = res.data.access_token;

        localStorage.setItem("token", newToken);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);

      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);

export default http;
