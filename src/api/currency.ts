import request from "@/utils/request";
const CURRENCY_BASE_URL = "/config/currency";
const CURRENCY_HISTORY_BASE_URL = "/config/currency/history";

// list数据查询
export function getCurrencyList(params: any) {
  return request({
    url: `${CURRENCY_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addCurrency(data: any) {
  return request({
    url: `${CURRENCY_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateCurrency(data: any) {
  return request({
    url: `${CURRENCY_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getCurrencyDetails(params: any) {
  return request({
    url: `${CURRENCY_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteCurrency(params: any) {
  return request({
    url: `${CURRENCY_BASE_URL}/del/${params}`,
    method: "delete",
  });
}

// history模块
// list数据查询
export function getHistoryList() {
  return request({
    url: `${CURRENCY_HISTORY_BASE_URL}/list`,
    method: "get",
  });
}

// 获取currency code
export function getHistoryCode(params: any) {
  return request({
    url: `${CURRENCY_HISTORY_BASE_URL}/code/${params}`,
    method: "get",
  });
}
