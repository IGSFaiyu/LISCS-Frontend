import request from "@/utils/request";
const APPLICANT_BASE_URL = "/applicant";

// list数据查询
export function getApplicantList(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/list`,
    method: 'get',
    params
  });
}

export function getApprovedList(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/approvedList`,
    method: 'get',
    params
  });
}

export function getRejectedList(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/rejectedList`,
    method: 'get',
    params
  });
}

// 添加
export function addApplicant(data: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateApplicant(data: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getApplicantDetails(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/detail/${params}`,
    method: "get",
  });
}

// 解锁
export function unlockApplicant(data: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/unlock_applicant`,
    method: "post",
    data
  });
}

// 锁定
export function lockApplicant(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/list_locked`,
    method: "post",
  });
}

// 重置密码
export function changePassword(data: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/reset_password`,
    method: "post",
    data
  });
}

// 查询历史数据
export function getPastApplication(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/search_past_application`,
    method: "get",
    params
  });
}

// 查询余额
export function getBalance(params: any) {
  return request({
    url: `${APPLICANT_BASE_URL}/remaining_balance/${params}`,
    method: "get",
  });
}
