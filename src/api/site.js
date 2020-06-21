import request from "@/utils/request";

export function listSite(data) {
  return request({
    url: "api/site/list",
    method: "post",
    data
  });
}
export function editSite(data) {
  return request({
    url: "api/site/edit",
    method: "post",
    data
  });
}
export function addSite(data) {
  return request({
    url: "api/site/add",
    method: "post",
    data
  });
}
