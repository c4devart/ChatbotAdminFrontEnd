import request from "@/utils/request";

export function listKeyword(data) {
  return request({
    url: "api/keyword/list",
    method: "post",
    data
  });
}
export function editKeyword(data) {
  return request({
    url: "api/keyword/edit",
    method: "post",
    data
  });
}
export function addKeyword(data) {
  return request({
    url: "api/keyword/add",
    method: "post",
    data
  });
}
