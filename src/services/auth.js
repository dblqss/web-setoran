import axios from "axios";

const AUTH_URL =
  "https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token";

export const auth = {
  async login(username, password) {
    const res = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        client_id: "setoran-mobile-dev",
        client_secret: "aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl",
        grant_type: "password",
        username,
        password,
        scope: "openid profile email"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const data = res.data;

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("id_token", data.id_token);

    return data;
  },

  logout() {
    localStorage.clear();
  }
};