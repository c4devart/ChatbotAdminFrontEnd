import request from "@/utils/request";

export function login(data) {
  return request({
    url: "api/user/login",
    method: "post",
    data
  });
}

export function getInfo(data) {
  return request({
    url: "api/user/info",
    method: "post",
    data
  });
}

export function logout(data) {
  return request({
    url: "api/user/logout",
    method: "post",
    data
  });
}

export function updateProfile(data) {
  return request({
    url: "api/user/updateProfile",
    method: "post",
    data
  });
}

export function changePassword(data) {
  return request({
    url: "api/user/changePassword",
    method: "post",
    data
  });
}

export function avatarUpload(data) {
  return request({
    url: "api/user/avatarUpload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  });
}

export function getAvatar(data) {
  return request({
    url: "api/image/avatar",
    method: "post",
    data
  });
}
