import request from "@/utils/request";

export function sendNotification(data) {
  return request({
    url: "api/notification/send",
    method: "post",
    data
  });
}
