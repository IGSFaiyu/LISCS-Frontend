export {
  getRoleList,
  addRole,
  updateRole,
  getRoleDetails,
  deleteRole,
} from "./role";

export {
  getBankList,
  addBank,
  updateBank,
  getBankDetails,
  deleteBank,
} from "./bank";

export {
  getCourseList,
  addCourse,
  updateCourse,
  getCourseDetails,
  deleteCourse,
  getModuleList,
  addModule,
  updateModule,
  getModuleDetails,
  deleteModule,
} from "./course";

export {
  getCourseProList,
  addCoursePro,
  updateCoursePro,
  getCourseProDetails,
  deleteCoursePro,
} from "./courseProvider";

export {
  getCurrencyList,
  addCurrency,
  updateCurrency,
  getCurrencyDetails,
  deleteCurrency,
  getHistoryList,
  getHistoryCode,
} from "./currency";

export {
  getEnCategoryList,
  addEnCategory,
  updateEnCategory,
  getEnCategoryDetails,
  deleteEnCategory,
} from "./enquiryCategory";

export {
  getInCategoryList,
  addInCategory,
  updateInCategory,
  getInCategoryDetails,
  deleteInCategory,
} from "./inquirtyCategory";

export {
  getJobNatureList,
  addJobNature,
  updateJobNature,
  getJobNatureDetails,
  deleteJobNature,
} from "./jobNature";

export {
  getProAreaList,
  addProArea,
  updateProArea,
  getProAreaDetails,
  deleteProArea,
  getProTemplateList,
  addProTemplate,
  updateProTemplate,
  deleteProTemplate,
} from "./problematicArea";

export {
  getSettingList,
  addSetting,
  updateSetting,
  getSettingDetails,
  deleteSetting,
  saveView,
} from "./setting";

export {
  getApplicationBank,
  GetJobNature,
  saveNewApplication,
  saveNewCourseApplication,
  submitNewApplication,
  saveHkic,
  modifyHkic,
  saveBankProof,
  modifyBankProof,
  saveEmploymentProof,
  modifyEmploymentProof,
  saveCertificate,
  modifyCertificate,
  saveReceipt,
  modifyReceipt,
  getCourseProvider,
  getCourse,
  getCurrency,
  getApplicationInfo,
  getPersonalInfoByApplicationId,
  getPersonalInfoByApplicantId,
  getUploadedDoc,
  preViewFile,
  getModule,
  getCourseApplication,
  saveEvaluation,
  getEvaluation,
  deleteFile,
  archiveFile,
  getApplicationList,
  getMaritimeList,
  getAviationList,
  getAttachmentInternalTypeApi,
  getAttachmentInternalFileListApi,
  getAttachmentArchiveFileListApi,
  uploadInternaleFileApi,
  getApplicantDetailApi,
  approvalAndRejectForm,
  completenessCommentForm,
  getDashboard
} from "./application";

export {
  getApplicantList,
  getApprovedList,
  getRejectedList,
  addApplicant,
  updateApplicant,
  getApplicantDetails,
  unlockApplicant,
  lockApplicant,
  changePassword,
  getPastApplication,
  getBalance,
} from "./applicant";

export {
  getInternalUserList,
  updateInternalUser,
  getInternalUserDetails,
  manualSync,
} from "./internalUser";

export {
  getLetterTemplateList,
  saveLetterTemplate,
  getLetterTemplateDetails,
} from "./letterTemplate";

export {
  getReasonList,
  saveReason,
  updateReason,
  deleteReason,
} from "./rejectionReason";

export { getsummaryList } from "./home";

export {
  getAcknowledgementList,
  prepareAck,
  getApprovalList,
  getQueryList,
  getStopProcessingList,
  getRejectionList,
  getReviewList,
  getMailDetail,
  regenerateMail,
  confirmMail,
  saveMail,
  sendMail,
} from "./mailQueue";

export { getWorkflowStatusList } from "./workflow";
