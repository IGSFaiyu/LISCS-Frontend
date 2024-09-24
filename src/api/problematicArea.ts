import request from "@/utils/request";
const PRO_AREA_BASE_URL = "/config/problematic_area";
const PRO_TEMPLATE_BASE_URL = "/config/problematic_area_template";

// list数据查询
export function getProAreaList(params: any) {
  return request({
    url: `${PRO_AREA_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addProArea(data: any) {
  return request({
    url: `${PRO_AREA_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateProArea(data: any) {
  return request({
    url: `${PRO_AREA_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 获取详情
export function getProAreaDetails(params: any) {
  return request({
    url: `${PRO_AREA_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteProArea(params: any) {
  return request({
    url: `${PRO_AREA_BASE_URL}/del/${params}`,
    method: "delete",
  });
}

// template
// list数据查询
export function getProTemplateList(params: any) {
  return request({
    url: `${PRO_TEMPLATE_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 添加
export function addProTemplate(data: any) {
  return request({
    url: `${PRO_TEMPLATE_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateProTemplate(data: any) {
  return request({
    url: `${PRO_TEMPLATE_BASE_URL}/update`,
    method: "patch",
    data,
  });
}

// 删除
export function deleteProTemplate(params: any) {
  return request({
    url: `${PRO_TEMPLATE_BASE_URL}/del/${params}`,
    method: "delete",
  });
}
