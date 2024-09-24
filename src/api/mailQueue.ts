import request from "@/utils/request";
const Mail_BASE_URL = "/email_queue";

// acknowledgementList数据查询
export function getAcknowledgementList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/acknowledgement`,
    method: "get",
    params
  });
}

// acknowledgementList数据查询
export function prepareAck(data: any) {
  return request({
    url: `${Mail_BASE_URL}/acknowledgement/prepare`,
    method: "post",
    data
  });
}

// rejectionList数据查询
export function getRejectionList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/rejection`,
    method: "get",
    params
  });
}

// StopProcessing数据查询
export function getStopProcessingList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/stop_processing`,
    method: "get",
    params
  });
}

// queryList数据查询
export function getQueryList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/query`,
    method: "get",
    params
  });
}

// StopProcessing数据查询
export function getApprovalList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/approval`,
    method: "get",
    params
  });
}

// review letter list数据查询
export function getReviewList(params: any) {
  return request({
    url: `${Mail_BASE_URL}/review/application_list`,
    method: "get",
    params
  });
}

// review letter数据查询
export function getMailDetail(params: any) {
  return request({
    url: `${Mail_BASE_URL}/review/mail`,
    method: "get",
    params
  });
}

// regenerate
export function regenerateMail(data: any) {
  return request({
    url: `${Mail_BASE_URL}/review/mail/regenerate`,
    method: "post",
    data
  });
}

// confirm
export function confirmMail(data: any) {
  return request({
    url: `${Mail_BASE_URL}/review/mail/confirm`,
    method: "post",
    data
  });
}

// save
export function saveMail(data: any) {
  return request({
    url: `${Mail_BASE_URL}/review/mail/save`,
    method: "post",
    data
  });
}

// send
export function sendMail(data: any) {
  return request({
    url: `${Mail_BASE_URL}/review/mail/send`,
    method: "post",
    data
  });
}
