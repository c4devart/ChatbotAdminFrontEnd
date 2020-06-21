import request from "@/utils/request";

export function listCategory(data) {
  return request({
    url: "api/category/list",
    method: "post",
    data
  });
}
export function editCategory(data) {
  return request({
    url: "api/category/edit",
    method: "post",
    data
  });
}
export function getCategory(data) {
  return request({
    url: "api/category/getCategory",
    method: "post",
    data
  });
}
export function getCategoryList(data) {
  return request({
    url: "api/category/getCategoryList",
    method: "post",
    data
  });
}
export function addNode(data) {
  return request({
    url: "api/category/addNode",
    method: "post",
    data
  });
}
export function renameNode(data) {
  return request({
    url: "api/category/renameNode",
    method: "post",
    data
  });
}
export function getKeywordList(data) {
  return request({
    url: "api/category/getKeywordList",
    method: "post",
    data
  });
}
export function getKeywords(data) {
  return request({
    url: "api/category/getKeywords",
    method: "post",
    data
  });
}
