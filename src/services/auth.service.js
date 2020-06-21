import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(admin) {
    return axios
      .post(API_URL + "signin", {
        email: admin.email,
        password: admin.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("admin", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("admin");
  }

  register(admin) {
    return axios.post(API_URL + "signup", {
      name: admin.name,
      email: admin.email,
      password: admin.password
    });
  }
}

export default new AuthService();
