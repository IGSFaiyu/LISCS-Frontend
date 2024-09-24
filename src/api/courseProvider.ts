import request from "@/utils/request";
const COURSE_PROVIDER_BASE_URL = "/config/course_provider";

// list数据查询
export function getCourseProList(params: any) {
  return request({
    url: `${COURSE_PROVIDER_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addCoursePro(data: any) {
  return request({
    url: `${COURSE_PROVIDER_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateCoursePro(data: any) {
  return request({
    url: `${COURSE_PROVIDER_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getCourseProDetails(params: any) {
  return request({
    url: `${COURSE_PROVIDER_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteCoursePro(params: any) {
  return request({
    url: `${COURSE_PROVIDER_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
