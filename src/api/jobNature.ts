import request from "@/utils/request";
const JOB_NATURE_BASE_URL = "/config/job_nature";

// list数据查询
export function getJobNatureList(params: any) {
  return request({
    url: `${JOB_NATURE_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addJobNature(data: any) {
  return request({
    url: `${JOB_NATURE_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateJobNature(data: any) {
  return request({
    url: `${JOB_NATURE_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getJobNatureDetails(params: any) {
  return request({
    url: `${JOB_NATURE_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteJobNature(params: any) {
  return request({
    url: `${JOB_NATURE_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
