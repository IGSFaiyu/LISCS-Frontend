import request from "@/utils/request";
const ROLE_BASE_URL = "/config/role";

// roleList数据查询
export function getRoleList(params: any) {
  // return request({
  //   url: `${ROLE_BASE_URL}/list`,
  //   method: "get",
  //   params
  // });
  return {
    "code": 200,
    "data": [
      {
        "deleted": false,
        "createdBy": 0,
        "createdBySnap": null,
        "createdOn": "2024-05-31T03:36:50.000+00:00",
        "modifiedBy": 0,
        "modifiedBySnap": "System Init",
        "modifiedOn": "2024-05-31T03:36:50.000+00:00",
        "roleId": 1,
        "descEng": "Registration Officer ",
        "rank": 1
      },
      {
        "deleted": false,
        "createdBy": 0,
        "createdBySnap": null,
        "createdOn": "2024-05-31T03:36:50.000+00:00",
        "modifiedBy": 0,
        "modifiedBySnap": "System Init",
        "modifiedOn": "2024-05-31T03:36:50.000+00:00",
        "roleId": 2,
        "descEng": "Screening Officer",
        "rank": 1
      },
      {
        "deleted": false,
        "createdBy": 0,
        "createdBySnap": null,
        "createdOn": "2024-05-31T03:36:50.000+00:00",
        "modifiedBy": 0,
        "modifiedBySnap": "System Init",
        "modifiedOn": "2024-05-31T03:36:50.000+00:00",
        "roleId": 3,
        "descEng": "Data Integrity Officer",
        "rank": 1
      },
    ],
    "message": "success"
  }
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
