import request from "@/utils/request";
const EN_CATEGORY_BASE_URL = "/config/case_enquiry_category";

// list数据查询
export function getEnCategoryList(params: any) {
  return request({
    url: `${EN_CATEGORY_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addEnCategory(data: any) {
  return request({
    url: `${EN_CATEGORY_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateEnCategory(data: any) {
  return request({
    url: `${EN_CATEGORY_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getEnCategoryDetails(params: any) {
  return request({
    url: `${EN_CATEGORY_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteEnCategory(params: any) {
  return request({
    url: `${EN_CATEGORY_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
