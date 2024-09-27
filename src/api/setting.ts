import request from "@/utils/request";
const SETTING_BASE_URL = "/config/general_setting";
const SETTING_TABLE_URL = "/view";

// list数据查询
export function getSettingList() {
  return request({
    url: `${SETTING_BASE_URL}/list`,
    method: "get",
  });
}

// 添加
export function addSetting(data: any) {
  return request({
    url: `${SETTING_BASE_URL}/add`,
    method: "post",
    data,
  });
}

// 编辑
export function updateSetting(data: any) {
  // return request({
  //   url: `${SETTING_BASE_URL}/update`,
  //   method: "patch",
  //   data,
  // });
  return {
    code: 200,
    message: "Success"
  }
}

// 获取详情
export function getSettingDetails(params: any) {
  return request({
    url: `${SETTING_BASE_URL}/${params}`,
    method: "get",
  });
}

// 删除
export function deleteSetting(params: any) {
  return request({
    url: `${SETTING_BASE_URL}/del/${params}`,
    method: "delete",
  });
}

// 设置表格列展示
export function saveView(data: any) {
  return request({
    url: `${SETTING_TABLE_URL}/save`,
    method: "post",
    data
  });
}
