import request from "@/utils/request";

export function listFaq(data) {
  return request({
    url: "api/faq/list",
    method: "post",
    data
  });
}
export function editFaq(data) {
  return request({
    url: "api/faq/edit",
    method: "post",
    data
  });
}
export function addFaq(data) {
  return request({
    url: "api/faq/add",
    method: "post",
    data
  });
}
export function getFaq(data) {
  return request({
    url: "api/faq/getFaq",
    method: "post",
    data
  });
}

export function getKeywords(data) {
  return request({
    url: "api/faq/getKeywords",
    method: "post",
    data
  });
}
