import request from "@/utils/request";
const INQUIRY_CATEGORY_BASE_URL = "/config/inquiry_category";

// list数据查询
export function getInCategoryList(params: any) {
  return request({
    url: `${INQUIRY_CATEGORY_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addInCategory(data: any) {
  return request({
    url: `${INQUIRY_CATEGORY_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateInCategory(data: any) {
  return request({
    url: `${INQUIRY_CATEGORY_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getInCategoryDetails(params: any) {
  return request({
    url: `${INQUIRY_CATEGORY_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteInCategory(params: any) {
  return request({
    url: `${INQUIRY_CATEGORY_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
