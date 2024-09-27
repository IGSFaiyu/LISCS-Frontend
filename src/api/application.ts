import request from "@/utils/request";
import testData from "../assets/testData.json";
import statusCode from "../assets/statusCode.json";
import submitType from "../assets/submitType.json";
import * as comon from "../comon";
import { random } from "lodash";
const APPLICATION_BASE_URL = "/application";
const FILE_BASE_URL = "/application/file";

// list数据查询
export function getApplicationBank() {
  return request({
    url: `${APPLICATION_BASE_URL}/bank`,
    method: "get",
  });
}

export function GetJobNature(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/job_nature/${data}`,
    method: "get",
  });
}

export async function saveNewApplication(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/save_application`,
  //   method: "post",
  //   data,
  // });
  return {
    "code": 200,
    "data": {
      applicationId: Math.floor(Math.random() * 999)
    },
    message: "Success"
  }
}

export function saveNewCourseApplication(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/course_application`,
    method: "post",
    data,
  });
}

export function submitNewApplication(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/save/submit`,
  //   method: "post",
  //   data,
  // });
  return {
    "code": 200,
    "data": {
      applicationId: Math.floor(Math.random() * 999)
    },
    message: "Success"
  }
}

export function saveHkic(data: any) {
  return request({
    url: `${FILE_BASE_URL}/save/hkic`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function modifyHkic(data: any) {
  return request({
    url: `${FILE_BASE_URL}/modify/upload/hkic`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function saveBankProof(data: any) {
  return request({
    url: `${FILE_BASE_URL}/save/bank_proof`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function modifyBankProof(data: any) {
  return request({
    url: `${FILE_BASE_URL}/modify/upload/bank`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function saveEmploymentProof(data: any) {
  return request({
    url: `${FILE_BASE_URL}/save/employment_proof`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function modifyEmploymentProof(data: any) {
  return request({
    url: `${FILE_BASE_URL}/modify/upload/employment_proof`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function saveCertificate(data: any) {
  return request({
    url: `${FILE_BASE_URL}/save/cert`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function modifyCertificate(data: any) {
  return request({
    url: `${FILE_BASE_URL}/modify/upload/cert`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function saveReceipt(data: any) {
  return request({
    url: `${FILE_BASE_URL}/save/receipt`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function modifyReceipt(data: any) {
  return request({
    url: `${FILE_BASE_URL}/modify/upload/receipt`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getCourseProvider(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/course_provider/${data}`,
    method: "get",
  });
}

export function getCourse(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/course/${data}`,
    method: "get",
  });
}

export function getCurrency() {
  return request({
    url: `${APPLICATION_BASE_URL}/currency`,
    method: "get",
  });
}

export function getApplicationInfo(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/application_detail/${data}`,
  //   method: "get",
  // });
  let result = testData.filter(el => el.applicationId == data)[0];
  let status = statusCode.filter(el => el.value == result.internalStatus)[0];
  return {
    "code": 200,
    "data": {
      "internalStatus": status.label,
      "submitType": submitType.filter(el => el.value == result.submitType)[0].label,
      "workflowState": result.internalStatus,
      "applicationNo": result.applicationNo ? result.applicationNo : "N/A",
      "externalStatus": status.label,
      "applicationId": result.applicationId
    },
    "message": "success"
  }
}

export function getPersonalInfoByApplicationId(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/get_application/${data}`,
  //   method: "get",
  // });
  let result = testData.filter(el => el.applicationId == data)[0];
  return {
    "code": 200,
    "data": result,
    "message": "application found"
  }
}

export function getPersonalInfoByApplicantId(data: any) {
  return request({
    url: `/applicant/detail/${data}`,
    method: "get",
  });
}

export function getUploadedDoc(data: any) {
  return request({
    url: `${FILE_BASE_URL}/list/${data}`,
    method: "get",
  });
}

export function preViewFile(id: any, name: any) {
  return request({
    url: `${FILE_BASE_URL}/view?applicationId=${id}&fileName=${name}`,
    // url: `${FILE_BASE_URL}/view?applicationId=${id}&fileName=Cert_MC002_{f30b6}_LEE KIM.pdf`,
    method: "get",
    responseType: "blob",
  });
}

export function getModule(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/module/${data}`,
    method: "get",
  });
}

export function getCourseApplication(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/course_application/${data}`,
    method: "get",
  });
}

export function saveEvaluation(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/aviation_evaluation`,
    method: "post",
    data,
  });
}

export function getEvaluation(data: String) {
  return request({
    url: `${APPLICATION_BASE_URL}/aviation_evaluation/${data}`,
    method: "get",
  });
}

export function deleteFile(data: any) {
  return request({
    url: `${FILE_BASE_URL}/delete`,
    method: "post",
    data,
  });
}

export function archiveFile(data: any) {
  return request({
    url: `${FILE_BASE_URL}/archive`,
    method: "post",
    data,
  });
}

// drafts list
export function getApplicationList(params: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/list`,
    method: "get",
    params,
  });
}

// maritime list
export function getMaritimeList(params: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/list/M`,
    method: "get",
    params,
  });
}

// aviation list
export function getAviationList(params: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/list/A`,
    method: "get",
    params,
  });
}

export function getAttachmentInternalTypeApi() {
  return request({
    url: `${FILE_BASE_URL}/internal/category`,
    method: "get",
  });
}

export function getAttachmentInternalFileListApi(params: any) {
  return request({
    url: `${FILE_BASE_URL}/internal/list/${params}`,
    method: "get",
  });
}

export function getAttachmentArchiveFileListApi(params: any) {
  return request({
    url: `${FILE_BASE_URL}/internal/archive/list/${params}`,
    method: "get",
  });
}

export function uploadInternaleFileApi(data: any) {
  return request({
    url: `${FILE_BASE_URL}/internal/upload`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getApplicantDetailApi(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/applicant_detail/${data}`,
  //   method: "get",
  // });

  let result = testData.filter(el => el.applicationId == data)[0];
  return {
    "code": 200,
    "data": {
      "balance": 0.0,
      "claimAmount": 0.0,
      "totalClaimableAmount": 0.0,
      "applicantName": result.contractorName,
      "applicantId": result.applicationId,
      "HKID": ""
    },
    "message": "success"
  }
}

export function approvalAndRejectForm(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/approval`,
  //   method: "post",
  //   data,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });
  return {
    "code": 200,
    message: "Success"
  }
}

export function completenessCommentForm(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/completenessComment`,
  //   method: "post",
  //   data,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });
  return {
    "code": 200,
    message: "Success"
  }
}

export function getDashboard(data: any) {
  // return request({
  //   url: `${APPLICATION_BASE_URL}/dashboard_find`,
  //   method: "post",
  //   data,
  //   // headers: {
  //   //   "Content-Type": "multipart/form-data",
  //   // },
  // });
  let filterAry: any = comon.getfliterAry(data);
  let result = comon.sortingData(testData, data.sortColumn, data.sortOrder).filter(el => filterAry.length == 0 || eval(filterAry.join(" && ")));
  if (data.sortColumn == "applicantId"){
    result = comon.sortingData(result, "submitVersion", false);
  }
  let pageable = comon.getPageable(data, result);
  return {
    "code": 200,
    "data": {
      ...pageable,
      "content": result.slice(data.page * data.size, (data.page + 1) * data.size)
    }
  }
}

export function getToDoList(data: any) {
  let filterAry: any = comon.getfliterAry(data);
  let result = comon.sortingData(testData, data.sortColumn, data.sortOrder).filter(el => filterAry.length == 0 || eval(filterAry.join(" && ")));
  if (data.sortColumn == "applicantId"){
    result = comon.sortingData(result, "submitVersion", false);
  }
  result = result.filter(el=> [2].includes(el.internalStatus))
  let pageable = comon.getPageable(data, result);
  return {
    "code": 200,
    "data": {
      ...pageable,
      "content": result.slice(data.page * data.size, (data.page + 1) * data.size)
    }
  }
}