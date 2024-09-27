import request from "@/utils/request";
import * as comon from "../comon";
import account from "../assets/account.json";
const INTERNAL_USER_BASE_URL = "/config/internalUser";

// internalUserList数据查询
export function getInternalUserList(params: any) {
  // return request({
  //   url: `${INTERNAL_USER_BASE_URL}/list`,
  //   method: "get",
  //   params
  // });

  let filterAry: any = comon.getfliterAry(params);
  let result = comon.sortingData(account, params.sortColumn, params.sortOrder).filter(el => filterAry.length == 0 || eval(filterAry.join(" && ")));
  if (params.sortColumn == "applicantId") {
    result = comon.sortingData(result, "submitVersion", false);
  }
  let pageable = comon.getPageable(params, result);
  return {
    "code": 200,
    "data": {
      ...pageable,
      "content": result.slice(params.page * params.size, (params.page + 1) * params.size)
    }
  }
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
  // return request({
  //   url: `${INTERNAL_USER_BASE_URL}/update`,
  //   method: "patch",
  //   data,
  // });
  return {
    "code": 200,
    "message": "Success"
  }
}

// 获取internalUser详情
export function getInternalUserDetails(params: any) {
  // return request({
  //   url: `${INTERNAL_USER_BASE_URL}/${params}`,
  //   method: "get",
  // });
  return {
    "code": 200,
    "data": {
      "deleted": false,
      "createdBy": 0,
      "createdBySnap": null,
      "createdOn": "2024-08-01T03:31:21.000+00:00",
      "modifiedBy": 30,
      "modifiedBySnap": "admin(admin)",
      "modifiedOn": "2024-08-22T02:07:49.000+00:00",
      "userId": 1,
      "adName": "admin",
      "emailAddress": "admin@tlb.gov.hk",
      "roleId": 2,
      "nameChi": "admin",
      "nameEng": "admin",
      "division": "A,I",
      "post": "admin",
      "isAdmin": false
    },
    "message": "success"
  }
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
