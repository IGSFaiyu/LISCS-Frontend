import request from "@/utils/request";
const BANK_BASE_URL = "/config/bank";

// list数据查询
export function getBankList(params: any) {
  return request({
    url: `${BANK_BASE_URL}/list`,
    method: 'get',
    params
  });
}

// 添加
export function addBank(data: any) {
  return request({
    url: `${BANK_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateBank(data: any) {
  return request({
    url: `${BANK_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getBankDetails(params: any) {
  return request({
    url: `${BANK_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteBank(params: any) {
  return request({
    url: `${BANK_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
