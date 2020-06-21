import request from "@/utils/request";

export function getChatSessions(data) {
  return request({
    url: "api/chat/sessions",
    method: "post",
    data
  });
}

export function getChatsBySessionId(data) {
  return request({
    url: "api/chat/chatBySessionId",
    method: "post",
    data
  });
}

export function getArchiveChatsBySessionId(data) {
  return request({
    url: "api/chat/archiveChatBySessionId",
    method: "post",
    data
  });
}

export function getChatArchives(data) {
  return request({
    url: "api/chat/archives",
    method: "post",
    data
  });
}

export function getChatOperators(data) {
  return request({
    url: "api/chat/operators",
    method: "post",
    data
  });
}

export function getNewCustomer(data) {
  return request({
    url: "api/chat/getNewCustomer",
    method: "post",
    data
  });
}

export function getAdditionalInfo(data) {
  return request({
    url: "api/chat/getAdditionalInfo",
    method: "post",
    data
  });
}

export function addNewMsg(data) {
  return request({
    url: "api/chat/newMessage",
    method: "post",
    data
  });
}

export function getSuggestionsByAWS(data) {
  return request({
    url: "api/chat/awsComprehend",
    method: "post",
    data
  });
}

export function getSuggestionsByKeyword(data) {
  return request({
    url: "api/chat/getSuggestionsByKeyword",
    method: "post",
    data
  });
}

export function addCustomerTags(data) {
  return request({
    url: "api/chat/addCustomerTags",
    method: "post",
    data
  });
}
