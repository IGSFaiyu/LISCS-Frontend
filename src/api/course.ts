import request from "@/utils/request";
const COURSE_BASE_URL = "/config/course";
const MODULE_BASE_URL = "/config/module";

// list数据查询
export function getCourseList(params: any) {
  return request({
    url: `${COURSE_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addCourse(data: any) {
  return request({
    url: `${COURSE_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateCourse(data: any) {
  return request({
    url: `${COURSE_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getCourseDetails(params: any) {
  return request({
    url: `${COURSE_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteCourse(params: any) {
  return request({
    url: `${COURSE_BASE_URL}/del/${params}`,
    method: "delete",
  });
}

// module模块
// list数据查询
export function getModuleList(params: any) {
  return request({
    url: `${MODULE_BASE_URL}/list`,
    method: "get",
    params,
  });
}

// 添加
export function addModule(data: any) {
  return request({
    url: `${MODULE_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateModule(data: any) {
  return request({
    url: `${MODULE_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getModuleDetails(params: any) {
  return request({
    url: `${MODULE_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteModule(params: any) {
  return request({
    url: `${MODULE_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
