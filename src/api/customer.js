import request from "@/utils/request";

export function listCustomer(data) {
  return request({
    url: "api/customer/list",
    method: "post",
    data
  });
}

export function rateDetail(data) {
  return request({
    url: "api/customer/rateDetail",
    method: "post",
    data
  });
}

export function chatDetail(data) {
  return request({
    url: "api/customer/chatDetail",
    method: "post",
    data
  });
}
