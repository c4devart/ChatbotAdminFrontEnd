import Cookies from "js-cookie";

const TokenKey = "Chatbot-Admin-Token";
const AdminIdKey = "Admin-Id";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getAdminId() {
  return Cookies.get(AdminIdKey);
}

export function setAdminId(id) {
  return Cookies.set(AdminIdKey, id);
}

export function getCookie(key) {
  return Cookies.get(key);
}

export function setCookie(key, value) {
  return Cookies.set(key, value);
}
