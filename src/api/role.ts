import request from "@/utils/request";
const ROLE_BASE_URL = "/config/role";

// roleList数据查询
export function getRoleList(params: any) {
  return request({
    url: `${ROLE_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加role
export function addRole(data: any) {
  return request({
    url: `${ROLE_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑role
export function updateRole(data: any) {
  return request({
    url: `${ROLE_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取role详情
export function getRoleDetails(params: any) {
  return request({
    url: `${ROLE_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除role
export function deleteRole(params: any) {
  return request({
    url: `${ROLE_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
