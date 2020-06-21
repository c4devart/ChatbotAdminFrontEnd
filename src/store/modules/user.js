import { login, logout, getInfo } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  setAdminId,
  getAdminId,
  getCookie,
  setCookie
} from "@/utils/auth";

const nameKey = "name";
const emailKey = "email";
const siteNo = "siteno";
const siteLink = "sitelink";

const state = {
  token: getToken(),
  user_id: getAdminId(),
  name: getCookie(nameKey) || "",
  email: getCookie(emailKey) || "",
  site_no: getCookie(siteNo) || "",
  site_link: getCookie(siteLink) || "",
  avatar: "",
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ID: (state, id) => {
    state.user_id = id;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_SITENO: (state, siteno) => {
    state.site_no = siteno;
  },
  SET_SITELINK: (state, sitelink) => {
    state.site_link = sitelink;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username_email, password, token } = userInfo;
    return new Promise((resolve, reject) => {
      var data = {};
      if (token.length > 0) {
        data = {
          token: token
        };
      } else {
        data = {
          search_key: username_email.trim(),
          password: password
        };
      }
      login(data)
        .then(response => {
          const { data } = response;
          commit("SET_TOKEN", data.api_token);
          commit("SET_ID", data.id);
          setToken(data.token);
          setAdminId(data.id);
          setCookie(nameKey, data.name);
          setCookie(emailKey, data.email);
          setCookie(siteNo, data.site_no);
          setCookie(siteLink, data.link);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ token: state.token })
        .then(response => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { role, id, name, email, avatar, site_no, link } = data;

          // roles must be a non-empty array
          if (role === undefined || (role !== 1 && role !== 2)) {
            reject("getInfo: roles must be a non-null array!");
          }

          let roles = [];
          switch (role) {
            case 1:
              roles = ["admin"];
              break;
            case 2:
              roles = ["operator"];
              break;
          }
          data["roles"] = roles;

          commit("SET_ID", id);
          commit("SET_ROLES", roles);
          commit("SET_NAME", name);
          commit("SET_EMAIL", email);
          commit("SET_AVATAR", avatar);
          commit("SET_SITENO", site_no);
          commit("SET_SITELINK", link);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token })
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
