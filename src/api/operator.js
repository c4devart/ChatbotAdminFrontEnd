import request from "@/utils/request";

export function listOperator(data) {
  return request({
    url: "api/operator/list",
    method: "post",
    data
  });
}
export function editOperator(data) {
  return request({
    url: "api/operator/edit",
    method: "post",
    data
  });
}
export function addOperator(data) {
  return request({
    url: "api/operator/add",
    method: "post",
    data
  });
}
export function listSite(data) {
  return request({
    url: "api/operator/listSite",
    method: "post",
    data
  });
}
