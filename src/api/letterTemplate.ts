import request from "@/utils/request";
const LETTER_TEMPLATE_BASE_URL = "/config/mail_template";

// letterTemplateList数据查询
export function getLetterTemplateList(params: any) {
  return request({
    url: `${LETTER_TEMPLATE_BASE_URL}/list`,
    method: "get",
    params
  });
}

// 编辑letterTemplate
export function saveLetterTemplate(data: any) {
  return request({
    url: `${LETTER_TEMPLATE_BASE_URL}/save`,
    method: "post",
    data,
  });
}

// 获取letterTemplate详情
export function getLetterTemplateDetails(params: any) {
  return request({
    url: `${LETTER_TEMPLATE_BASE_URL}/${params}`,
    method: "get",
  });
}

