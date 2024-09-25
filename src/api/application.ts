import request from "@/utils/request";
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
  return request({
    url: `${APPLICATION_BASE_URL}/save_application`,
    method: "post",
    data,
  });
}

export function saveNewCourseApplication(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/course_application`,
    method: "post",
    data,
  });
}

export function submitNewApplication(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/save/submit`,
    method: "post",
    data,
  });
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
  return request({
    url: `${APPLICATION_BASE_URL}/application_detail/${data}`,
    method: "get",
  });
}

export function getPersonalInfoByApplicationId(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/get_application/${data}`,
    method: "get",
  });
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

function sortingData(data, prop, isAsc) {
  let haveData = data.filter(el => el[prop]);
  let emptyData = data.filter(el => !el[prop]);
  haveData = haveData.sort((a, b) => {
    return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1)
  });
  return [...haveData, ...emptyData];
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
  return request({
    url: `${APPLICATION_BASE_URL}/applicant_detail/${data}`,
    method: "get",
  });
}

export function approvalAndRejectForm(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/approval`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function completenessCommentForm(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/completenessComment`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getDashboard(data: any) {
  return request({
    url: `${APPLICATION_BASE_URL}/dashboard_find`,
    method: "post",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  });
}