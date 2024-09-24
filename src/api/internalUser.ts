import request from "@/utils/request";
const INTERNAL_USER_BASE_URL = "/config/internalUser";

// internalUserList数据查询
export function getInternalUserList(params: any) {
  return request({
    url: `${INTERNAL_USER_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加internalUser
// export function addInternalUser(data: any) {
//   return request({
//     url: `${INTERNAL_USER_BASE_URL}/add`,
//     method: "post",
//     data,
//   });
// }

// 编辑internalUser
export function updateInternalUser(data: any) {
  return request({
    url: `${INTERNAL_USER_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取internalUser详情
export function getInternalUserDetails(params: any) {
  return request({
    url: `${INTERNAL_USER_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除internalUser
// export function deleteInternalUser(params: any) {
//   return request({
//     url: `${INTERNAL_USER_BASE_URL}/del/${params}`,
//     method: "delete",
//   });
// }

// 手动同步
export function manualSync() {
  return request({
    url: `${INTERNAL_USER_BASE_URL}/manualSync`,
    method: "get",
  });
}
