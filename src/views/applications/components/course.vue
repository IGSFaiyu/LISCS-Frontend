<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="custom-form"
      v-loading="loading"
    >
      <div class="custom-form-title">
        C. Information on Course/Examination Free to be Refunded
      </div>
      <section style="display: contents">
        <el-form-item
          class="custom-form-item width-100"
          label="Name of Course Provider/Examination Authority"
          prop="providerId"
        >
          <el-select v-model="form.providerId" @change="changeCourseName">
            <el-option
              v-for="item in courseProviderOptions"
              :key="item.providerId"
              :label="item.nameEng"
              :value="item.providerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="Course / Examination Title"
          prop="courseId"
        >
          <el-select v-model="form.courseId" @change="changeCourseId">
            <el-option
              v-for="item in courseOptions"
              :key="item.courseId"
              :label="item.titleEng"
              :value="item.courseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="Subject / Module"
          prop="moduleId"
          v-if="form.courseId && moudleOptions.length > 0"
        >
          <el-select v-model="form.moduleId" @change="changeModuleId">
            <el-option
              v-for="item in moudleOptions"
              :key="item.moduleId"
              :label="item.titleEng"
              :value="item.moduleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="MATF Course/Examination Code"
          prop="examinationCode"
        >
          <el-input
            :disabled="true"
            v-model="form.examinationCode"
            style="width: 48%"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Course Period From(D/M/Y)"
          prop="coursePeriodFrom"
          :rules="rulesForCoursePeriod"
        >
          <el-date-picker
            v-model="form.coursePeriodFrom"
            type="date"
            format=" DD / MM / YYYY "
            value-format="YYYY-MM-DD"
            :disabled-date="disabledFromDate"
            style="width: 100%"
            @change="(val) => changeDate('from', val)"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Course Period To(D/M/Y)"
          prop="coursePeriodTo"
          :rules="rulesForCoursePeriod"
        >
          <el-date-picker
            v-model="form.coursePeriodTo"
            type="date"
            format=" DD / MM / YYYY "
            value-format="YYYY-MM-DD"
            :disabled-date="disabledToDate"
            style="width: 100%"
            @change="(val) => changeDate('to', val)"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Examination Date(D/M/Y)"
          prop="examDate"
          :rules="rulesForExamDate"
        >
          <el-date-picker
            v-model="form.examDate"
            type="date"
            format=" DD / MM / YYYY "
            value-format="YYYY-MM-DD"
            style="width: 100%"
            @change="(val) => changeDate('examDate', val)"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Certificate Issue Date(D/M/Y)"
          prop="certIssueDate"
        >
          <el-date-picker
            v-model="form.certIssueDate"
            type="date"
            format=" DD / MM / YYYY "
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Fee Payment Currency"
          prop="currency"
        >
          <el-select v-model="form.currency">
            <el-option
              v-for="item in currencyOptions"
              :key="item.currencyCode"
              :label="item.descEng"
              :value="item.currencyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Actual Tuition/Examination Fee paid by the Applicant"
          prop="feePaidByApplicant"
        >
          <el-input v-model="form.feePaidByApplicant" @change="changeFeePaid" />
        </el-form-item>
        <el-form-item class="custom-form-item" label="Refund Amount in HKD">
          <el-input v-model="form.refundAmount" />
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="Please upload a digital copy of certificate or transcript(Max 5MB)"
          v-if="courseApplicationId"
        >
          <div class="upload-content">
            <el-upload
              :http-request="(val) => requestUpload(val, 'cert')"
              :accept="acceptType"
              :show-file-list="false"
            >
              <el-button
                type="primary"
                :class="`default-button ${
                  certificateFileList.length === 0 ? '' : 'cancel'
                }`"
                >{{
                  certificateFileList.length === 0
                    ? "Upload Certificate or Transcript"
                    : "Re-Upload"
                }}
              </el-button>
              <el-button
                v-if="certificateFileList.length > 0"
                type="primary"
                :class="`default-button ${certificateFileList.length === 0 ? '' : 'cancel'}`"
                @click.stop="clickDelete(certificateFileList)"
              >
                {{ status === "submitted" ? "Archive" : "Delete" }}
              </el-button>
            </el-upload>
            <div v-for="(item, index) in certificateFileList" :key="index">
              <PreviewFile
                class="upload-content-preview"
                ref="fileRef"
                :file-name="item.filename"
                :application-id="item.applicationId || courseApplicationId"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="Please upload a digital copy of the course/examination payment receipt(Max 5MB)"
          v-if="courseApplicationId"
        >
          <div class="upload-content">
            <el-upload
              :http-request="(val) => requestUpload(val, 'receipt')"
              :accept="acceptType"
              :show-file-list="false"
            >
              <el-button
                type="primary"
                :class="`default-button ${
                  paymentFileList.length === 0 ? '' : 'cancel'
                }`"
                >{{ paymentFileList.length === 0 ? "Upload " : "Re-Upload" }}
              </el-button>
              <el-button
                v-if="paymentFileList.length > 0"
                type="primary"
                :class="`default-button ${paymentFileList.length === 0 ? '' : 'cancel'}`"
                @click.stop="clickDelete(paymentFileList)"
              >
                {{ status === "submitted" ? "Archive" : "Delete" }}
              </el-button>
            </el-upload>
            <div v-for="(item, index) in paymentFileList" :key="index">
              <PreviewFile
                class="upload-content-preview"
                ref="fileRef"
                :file-name="item.filename"
                :application-id="courseApplicationId"
              />
            </div>
          </div>
        </el-form-item>
      </section>
      <div class="custom-form-button">
        <el-button
          type="primary"
          @click="clickButton('save')"
          class="default-button"
          >Save</el-button
        >
        <el-button
          type="primary"
          @click="clickButton('submit')"
          class="default-button"
          :disabled="!courseApplicationId"
          >Submit</el-button
        >
        <el-button class="default-button cancel" @click="clickCancel"
          >Cancel</el-button
        >
      </div>
    </el-form>
    <Questionare
      v-if="
        courseApplicationId && courseApplicationId !== '' && type === 'Aviation'
      "
      :courseApplication-id="courseApplicationId"
      :isPeriod="!!form.coursePeriodFrom"
      :isExamDate="!!form.examDate"
    />
  </div>
</template>

<script lang="js" setup>
import { onMounted } from "vue";
import {
  getCourseProvider,
  getCourse,
  getCurrency,
  saveNewCourseApplication,
  submitNewApplication,
  getModule,
  getCourseApplication,
  getUploadedDoc,
  saveCertificate,
  modifyCertificate,
  saveReceipt,
  modifyReceipt,
  deleteFile,
} from "@/api/index";
import PreviewFile from "@/components/PreView/index.vue";
import Questionare from "./questionare.vue";

const props = defineProps({
  type: String,
  currentApplicationId: Number,
  applicationType: String,
});
const { type, currentApplicationId, applicationType } = toRefs(props);

const acceptType = ref(".pdf, .jpg, .jpeg, .png");

const emit = defineEmits(["changeType"]);

let courseProviderOptions = ref([]);
let totalCourseOptions = ref([]);
let courseOptions = ref([]);
let moudleOptions = ref([]);
let currencyOptions = ref([]);

const certificateFileList = ref([]);
const paymentFileList = ref([]);
const status = ref("");

const currentCourse = ref("");
const currentModule = ref({});
const courseApplicationId = ref("");

const rulesForCoursePeriod = ref([]);
const rulesForExamDate = ref([]);

const loading = ref(false);

watch(applicationType, (newV) => {
  status.value = newV;
});

const validatePeriod = (rule, value, callback) => {
  const { coursePeriodFrom, coursePeriodTo, examDate } = form.value;
  if (!coursePeriodFrom && !coursePeriodTo && !examDate)
    callback(new Error("Please at least select one date"));
  else callback();
};

const validateFeePaid = (rule, value, callback) => {
  /* console.log(
    currentModule.value,
    "currentModule.value",
    currentCourse.value,
    "currentCourse.value"
  ); */
  if (value) {
    const reg = /^\d+(\.\d{1,2})?$/;
    if (value * 1 > (currentModule.value.fee || currentCourse.value.fee)) {
      callback(
        new Error(
          `Please input the correct fee:smaller than ${currentModule.value.fee || currentCourse.value.fee}`
        )
      );
    } else if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("Up to two decimal places"));
    }
  } else {
    callback();
  }
};

const formRef = ref();

const form = ref({
  providerId: "",
  courseId: "",
  moduleId: "",
  examinationCode: "",
  coursePeriodFrom: "",
  coursePeriodTo: "",
  examDate: "",
  certIssueDate: "",
  currency: "",
  feePaidByApplicant: "",
  refundAmount: "",
});

const rules = ref({
  providerId: {
    required: true,
    message: "Please select course name",
    trigger: "blur",
  },
  courseId: {
    required: true,
    message: "Please select course",
    trigger: "blur",
  },
  moduleId: {
    required: true,
    message: "Please select mudle",
    trigger: "blur",
  },
  certIssueDate: {
    required: true,
    message: "Please select certificate issue date",
    trigger: "blur",
  },
  currency: {
    required: true,
    message: "Please select currency",
    trigger: "blur",
  },
  feePaidByApplicant: [
    {
      required: true,
      message: "Please input feePaidByApplicant",
      trigger: "blur",
    },
    { validator: validateFeePaid, trigger: "blur" },
  ],
  coursePeriodFrom: { validator: validatePeriod, trigger: "blur" },
  coursePeriodTo: { validator: validatePeriod, trigger: "blur" },
  examDate: { validator: validatePeriod, trigger: "blur" },
});

onMounted(() => {
  getCourseProviderFunction();
  getCourseFunction();
  getCurrencyFunction();
  if (currentApplicationId.value !== null)
    getUploadedDocFunction(currentApplicationId.value);
  // 确保有course后再获取信息
  // getCourseInfo();
});

const getCourseProviderFunction = async () => {
  try {
    loading.value = true;
    const category = type.value === "Maritime" ? "M" : "A";
    let { code, data, message } = await getCourseProvider(category);
    if (code === 200) {
      courseProviderOptions.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getCourseFunction = async () => {
  try {
    loading.value = true;
    const category = type.value === "Maritime" ? "M" : "A";
    let { code, data, message } = await getCourse(category);
    if (code === 200) {
      totalCourseOptions.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
    if (currentApplicationId.value !== null)
      getCourseInfo(currentApplicationId.value);
  }
};

const getCourseInfo = async (params) => {
  try {
    loading.value = true;
    let { code, data, message } = await getCourseApplication(params);
    if (code === 200) {
      form.value = { ...form.value, ...data[0] };
      currentCourse.value = totalCourseOptions.value.find(
        (item) => item.courseId === data[0]?.courseId
      );
      form.value.providerId = currentCourse.value?.providerId;
      form.value.examinationCode = currentCourse.value?.courseCode;
      courseOptions.value = totalCourseOptions.value.filter(
        (item) => item.providerId === currentCourse.value?.providerId
      );
      changeFeePaid(data[0]?.feePaidByApplicant);
      if (data[0]?.examDate)
        rulesForExamDate.value = {
          required: true,
          message: "Please select course period to date",
          trigger: "blur",
        };
      else if (data[0]?.coursePeriodFrom)
        rulesForCoursePeriod.value = {
          required: true,
          message: "Please select course period from date",
          trigger: "blur",
        };

      courseApplicationId.value = data[0]?.courseApplicationId;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getCurrencyFunction = async () => {
  try {
    loading.value = true;
    let { code, data, message } = await getCurrency();
    if (code === 200) {
      currencyOptions.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const clickButton = (type) => {
  formRef.value
    .validate()
    .then(() => {
      handleSave(type);
    })
    .catch(() => {
      console.log("error");
    });
};

const handleSave = async (type) => {
  // console.log(form.value, "----");
  try {
    loading.value = true;
    let obj = {};
    Reflect.ownKeys(form.value).forEach((item) => {
      if (form.value[item] && form.value[item] !== "null")
        obj[item] = form.value[item];
      else obj[item] = "";
    });
    const params = {
      ...obj,
      applicationId: currentApplicationId.value,
    };
    const { code, data, message } =
      type === "save"
        ? await saveNewCourseApplication(params)
        : await submitNewApplication(params);
    // console.log(code, data, message);
    if (code === 200) {
      ElMessage.success(message);
      if (type === "save")
        courseApplicationId.value = data?.applicationCourseId;
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

function requestUpload(fileInfo, type) {
  if (fileInfo.size >= 5 * 1024 * 1024) {
    ElMessage.warning(t("message.uploadTip", { size: 5 }));
    return;
  }
  let fileData = new FormData();
  fileData.append("file", fileInfo.file);
  fileData.append("applicationId", currentApplicationId.value);
  fileData.append("nameEng", sessionStorage.getItem("nameEng"));
  fileData.append("courseApplicationId", courseApplicationId.value);
  type === "cert" ? uploadCert(fileData) : uploadReceipt(fileData);
}

async function uploadCert(fileData) {
  try {
    let { code, message, data } =
      certificateFileList.value.length === 0
        ? await saveCertificate(fileData)
        : await modifyCertificate(fileData);
    if (code === 200) {
      certificateFileList.value.push({ filename: data.fileName });
      ElMessage.success(message);
      console.log(certificateFileList.value, "certificateFileList");
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function uploadReceipt(params) {
  try {
    let { code, message, data } =
      paymentFileList.value.length === 0
        ? await saveReceipt(params)
        : await modifyReceipt(params);
    if (code === 200) {
      paymentFileList.value.push({ filename: data.fileName });
      ElMessage.success(message);
      console.log(paymentFileList.value, "paymentFileList");
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

const changeCourseName = (val) => {
  form.value.courseId = "";
  courseOptions.value = totalCourseOptions.value.filter(
    (item) => item.providerId === val
  );
};

const changeCourseId = (val) => {
  currentCourse.value = totalCourseOptions.value.find(
    (item) => item.courseId === val
  );
  if (val !== "") {
    getModuleFunction(val);
    form.value.examinationCode = totalCourseOptions.value.filter(
      (item) => item.courseId === val
    )[0]?.courseCode;
  }
};

const changeModuleId = (val) => {
  currentModule.value = moudleOptions.value.find(
    (item) => item.moduleId === val
  );
};

const getModuleFunction = async (params) => {
  try {
    let { code, data, message } = await getModule(params);
    if (code === 200) {
      moudleOptions.value = data;
      form.value.moduleId = "";
      currentModule.value = {};
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
};

function disabledFromDate(time) {
  return form.value.coursePeriodTo
    ? time > new Date(form.value.coursePeriodTo).getTime()
    : "";
}

function disabledToDate(time) {
  return form.value.coursePeriodFrom
    ? time < new Date(form.value.coursePeriodFrom).getTime()
    : "";
}

const changeDate = (type, val) => {
  if (type === "from" || type === "to") {
    rulesForCoursePeriod.value = {
      required: true,
      message: "Please select course period from date",
      trigger: "blur",
    };
    form.value.examDate = "";
    rulesForExamDate.value = {};
    formRef.value.clearValidate();
  } else {
    rulesForExamDate.value = {
      required: true,
      message: "Please select course period to date",
      trigger: "blur",
    };
    form.value.coursePeriodFrom = "";
    form.value.coursePeriodTo = "";
    rulesForCoursePeriod.value = {};
    formRef.value.clearValidate();
  }
};

const changeFeePaid = (val) => {
  if (val) {
    const totalFee = currentModule.value?.fee || currentCourse.value?.fee;
    if (val * 1 > totalFee) return;
    if (val * 1 < totalFee * 0.3) {
      form.value.refundAmount = totalFee * 0.1;
    } else form.value.refundAmount = totalFee * 0.8;
  }
};

const getUploadedDocFunction = async (params) => {
  try {
    loading.value = true;
    const { code, data, message } = await getUploadedDoc(params);
    if (code === 200) {
      certificateFileList.value = data.filter((item) => item.docType === 3);
      paymentFileList.value = data.filter((item) => item.docType === 2);
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const clickCancel = () => {
  emit("changeType");
};

const clickDelete = async (arr) => {
  try {
    let { code, message } =
      status === "submitted"
        ? archiveFile({
            applicationId: arr[0].applicationId || applicationId.value,
            fileName: arr[0].filename,
          })
        : await deleteFile({
            applicationId: arr[0].applicationId || currentApplicationId.value,
            fileName: arr[0].filename,
          });
    if (code === 200) {
      getUploadedDocFunction(currentApplicationId.value);
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped></style>
