import request from "@/utils/request";
const REASON_BASE_URL = "/config/rejection_reason";

// List数据查询
export function getReasonList(params: any) {
  return request({
    url: `${REASON_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function saveReason(data: any) {
  return request({
    url: `${REASON_BASE_URL}/save`,
    method: "post",
    data,
  });
}

// 编辑
export function updateReason(data: any) {
  return request({
    url: `${REASON_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 删除
export function deleteReason(params: any) {
  return request({
    url: `${REASON_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
