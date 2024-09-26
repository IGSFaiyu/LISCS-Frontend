<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="custom-form"
      v-loading="loading"
    >
      <div class="custom-form-title">Applicant’s Particulars</div>
      <section style="display: contents">
        <el-form-item
          class="custom-form-item"
          label="Name of Principal Contractor"
          prop="contractorName"
        >
          <el-input v-model="form.contractorName"></el-input>
        </el-form-item>
        <el-form-item class="custom-form-item" label="Address" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Business Registration Certificate no."
          prop="certificateNo"
        >
          <el-input v-model="form.certificateNo"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Certificate of Incorporation no."
          prop="incorporationNo"
        >
          <el-input v-model="form.incorporationNo"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Name of the person-in-charge"
          prop="personInChargeName"
        >
          <el-input v-model="form.personInChargeName"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Post title of the personin-charge"
          prop="personInChargeTitle"
        >
          <el-input v-model="form.personInChargeTitle"></el-input>
        </el-form-item>
        <el-form-item class="custom-form-item" label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item class="custom-form-item" label="Tel. no." prop="telNo">
          <el-input v-model="form.telNo"></el-input>
        </el-form-item>

        <el-form-item class="custom-form-item" label="Fax no." prop="faxNo">
          <el-input v-model="form.faxNo"></el-input>
        </el-form-item>

        <div class="custom-form-title">
          Previous application submitted for importation quota under the Construction
          Sector Scheme
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between">
          <el-form-item
            class="custom-form-item"
            style="width: 30%"
            label="Application No."
            prop="previousApplicationNo1"
          >
            <el-input v-model="form.previousApplicationNo1" />
          </el-form-item>
          <el-form-item
            class="custom-form-item"
            style="width: 30%"
            label="Application No."
            prop="previousApplicationNo2"
          >
            <el-input v-model="form.previousApplicationNo2" />
          </el-form-item>
          <el-form-item
            class="custom-form-item"
            style="width: 30%"
            label="Application No."
            prop="previousApplicationNo3"
          >
            <el-input v-model="form.previousApplicationNo3" />
          </el-form-item>
        </div>
      </section>

      <div class="custom-form-title">Works Contract under Application</div>
      <section style="display: contents">
        <el-form-item
          class="custom-form-item"
          style="width: 45%"
          label="Contract no."
          prop="contractNo"
        >
          <el-input v-model="form.contractNo"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          style="width: 45%"
          label="Name of the contract"
          prop="contractName"
        >
          <el-input v-model="form.contractName"></el-input>
        </el-form-item>
        <el-form-item class="custom-form-item" label="Work site" prop="workSite">
          <el-input v-model="form.workSite"></el-input>
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Commencement date"
          prop="commencementDate"
        >
          <el-date-picker
            v-model="form.commencementDate"
            type="date"
            format="YYYY / MM / DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          class="custom-form-item"
          label="Target completion date"
          prop="targetCompletionDate"
        >
          <el-date-picker
            v-model="form.targetCompletionDate"
            type="date"
            format="YYYY / MM / DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <div class="custom-form-title">
          For public sector works contract, please fill in the following information
        </div>
        <el-form-item
          class="custom-form-item width-100"
          label="Value of the contract"
          prop="contractValue"
        >
          <el-radio-group style="width: 100%" v-model="form.contractValue">
            <el-radio style="width: 45%" value="Less than HK$1 billion"
              >Less than HK$1 billion</el-radio
            >
            <el-radio style="width: 45%" value="HK$1 billion or more"
              >HK$1 billion or more</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <div class="custom-form-title">
          Contact person of relevant Works Department/organisation
        </div>
        <div style="width: 45%">
          <el-form-item
            class="custom-form-item"
            style="width: 100%"
            label="(Name, post title, and name of Works Department/Organisation)"
            prop="contactPersonDO"
          >
            <el-input v-model="form.contactPersonDO"></el-input>
          </el-form-item>
        </div>
        <div style="width: 45%">
          <el-form-item
            class="custom-form-item"
            style="width: 100%"
            label="(Tel. no. and Email)"
            prop="contactPersonDOTelEmail"
          >
            <el-input v-model="form.contactPersonDOTelEmail"></el-input>
          </el-form-item>
        </div>

        <el-form-item
          class="custom-form-item"
          style="width: 100%"
          label="Please provide reasons(s) for importation of labour (please use a separate sheet of paper if necessary):"
          prop="reasonsImportationLabour"
        >
          <el-input v-model="form.reasonsImportationLabour" type="textarea"></el-input>
        </el-form-item>

        <div class="custom-form-title-second">
          For private sector works contract, please complete the following information for
          special circumstances for consideration by the Approving Authority
        </div>

        <el-checkbox
          label="contracts involving construction labour of special trades/disciplines4 (please
                  specify the special trades/disciplines):"
          v-model="specialTradesContractsChbx"
          @change="(event) => selectDetail(event, 'specialTradesContracts')"
        />
        <el-form-item
          class="custom-form-item"
          style="width: 100%"
          label=""
          prop="specialTradesContracts"
        >
          <el-input
            :disabled="!specialTradesContractsChbx"
            v-model="form.specialTradesContracts"
          ></el-input>
        </el-form-item>
        <el-checkbox
          label="Reason(s) for importation of labour and other exceptional circumstances warranting special consideration
            (please specify) (please use a separate sheet of paper if necessary): "
          v-model="specialConsiderationReasonChbx"
          @change="(event) => selectDetail(event, 'specialConsiderationReason')"
        />
        <el-form-item
          class="custom-form-item"
          style="width: 100%"
          label=""
          prop="specialConsiderationReason"
        >
          <el-input
            :disabled="!specialConsiderationReasonChbx"
            v-model="form.specialConsiderationReason"
          ></el-input>
        </el-form-item>

        <div class="custom-form-title">
          Except for contracts involving construction labour of special
          trades/disciplines, works contracts with special circumstances requiring special
          consideration must be private works contracts of a considerable scale. Please
          advise the scale of the works contract:
        </div>

        <div class="custom-form-title" style="margin-top: 10px">
          Residential development contracts
        </div>
        <div style="display: flex">
          <el-checkbox
            style="margin-right: 10px"
            label="Approximate number of units expected to be completed "
            v-model="residentialDevelopmentContractsChbx"
            @change="(event) => selectDetail(event, 'residentialDevelopmentContracts')"
          />
          <el-input
            :disabled="!residentialDevelopmentContractsChbx"
            v-model="form.residentialDevelopmentContracts"
          ></el-input>
        </div>

        <div class="custom-form-title" style="margin-top: 10px">
          Commercial development contracts
        </div>
        <div style="display: flex">
          <el-checkbox
            style="margin-right: 10px"
            label="Approximate non-residential building area "
            v-model="commercialDevelopmentContractsChbx"
            @change="(event) => selectDetail(event, 'commercialDevelopmentContracts')"
          />
          <el-input
            style="margin-right: 10px"
            :disabled="!commercialDevelopmentContractsChbx"
            v-model="form.commercialDevelopmentContracts"
          ></el-input>
          <label>m</label><sup>2</sup>
        </div>
        <div v-if="form.internalStatus == 3" style="margin-top: 15px; width: 100%">
          Select to User:
          <div>
            <el-form-item
              class="custom-form-item width-100"
              label="Value of the contract"
              prop="assignUser"
            >
              <el-radio-group style="width: 100%" v-model="assignUser">
                <el-radio style="width: 45%" value="User 1">User 1</el-radio>
                <el-radio style="width: 45%" value="User 2">User 2</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div v-if="form.internalStatus == 4" style="margin-top: 15px; width: 100%">
          Data Completeness Comment:
          <div>
            <el-input type="textarea" v-model="form.completenessComment"></el-input>
          </div>
        </div>
        <div class="customFormHistory" v-if="form.history && form.history.length > 0">
          <div class="custom-form-title">History</div>
          <div class="historyBox">
            <div class="historyHeader">
              <div class="historyTxtDiv" style="width: 13%">User</div>
              <div class="historyTxtDiv" style="width: 17%">Action Time</div>
              <div class="historyTxtDiv" style="width: 40%">Action Detail</div>
              <div class="historyTxtDiv" style="width: 40%">User Remark</div>
            </div>
            <div class="historyBody" v-for="item in form.history">
              <div class="historyTxtDiv" style="width: 13%">{{ item.userName }}</div>
              <div class="historyTxtDiv" style="width: 17%">
                {{ timestampToTime(new Date(item.time), "YYYY-MM-DD hh:mm:ss") }}
              </div>
              <div class="historyTxtDiv" style="width: 40%">{{ item.display }}</div>
              <div class="historyTxtDiv" style="width: 40%">{{ item.remark }}</div>
            </div>
          </div>
        </div>
      </section>

      <div
        class="custom-form-button"
        style="margin-top: 15px"
        v-if="form.internalStatus == 0"
      >
        <!-- <button @click="autoFill()">Testing</button> -->
        <el-button type="primary" @click="clickButton('save')" class="default-button"
          >Save</el-button
        >
        <el-button
          type="primary"
          @click="clickButton('submit')"
          class="default-button"
          :disabled="applicationId === ''"
          >Submit</el-button
        >
        <el-button class="default-button cancel" @click="clickCancel">Cancel</el-button>
      </div>

      <div
        class="custom-form-button"
        style="margin-top: 15px"
        v-if="form.internalStatus > 0"
      >
        <el-button
          v-if="form.internalStatus == 2"
          type="primary"
          @click="clickButton('vetting')"
          class="default-button btn-success"
          >Vetting</el-button
        >
        <el-button
          v-if="form.internalStatus == 3"
          type="primary"
          @click="clickButton('assign')"
          class="default-button btn-success"
          >Assign</el-button
        >
        <el-button
          v-if="[1, 4, 5, 6, 7, 8].includes(form.internalStatus)"
          type="primary"
          @click="clickButton('approval')"
          class="default-button btn-success"
          >Approval</el-button
        >
        <el-button
          v-if="[1, 8].includes(form.internalStatus)"
          type="primary"
          @click="clickButton('reject')"
          class="default-button btn-danger"
          >Reject</el-button
        >
        <el-button
          v-if="form.internalStatus == 4"
          type="primary"
          @click="clickButton('comment')"
          class="default-button btn-secondary"
          >Comment</el-button
        >
        <el-button class="default-button cancel" @click="clickCancel">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="js" setup>
import { reactive, onActivated, watch, onMounted } from "vue";
import {
  getApplicationBank,
  GetJobNature,
  saveNewApplication,
  submitNewApplication,
  approvalAndRejectForm,
  completenessCommentForm,
  saveHkic,
  modifyHkic,
  saveBankProof,
  modifyBankProof,
  saveEmploymentProof,
  modifyEmploymentProof,
  getApplicationInfo,
  getPersonalInfoByApplicationId,
  getPersonalInfoByApplicantId,
  getUploadedDoc,
  deleteFile,
  archiveFile,
} from "@/api/index";
import { ElMessage } from "element-plus";
import PreviewFile from "@/components/PreView/index.vue";
import * as common from "../../../comon";
import router from "@/router";
import { timestampToTime } from "@/utils/formatTime.js";

const props = defineProps({
  type: String,
  isSaved: Boolean,
  currentApplicationId: Number,
  applicationType: String,
});
const { type, isSaved, currentApplicationId, applicationType } = toRefs(props);
const emit = defineEmits([
  "changeIsSaved",
  "getApplicationInfoFunction",
  "changeType",
]);

const acceptType = ref(".pdf, .jpg, .jpeg, .png");
const hkicFileList = ref([]);
const bankFileList = ref([]);
const employmentFileList = ref([]);
const specialTradesContractsChbx = ref(false);
const specialConsiderationReasonChbx = ref(false);
const residentialDevelopmentContractsChbx = ref(false);
const commercialDevelopmentContractsChbx = ref(false);

const applicationId = ref("");
const fileRef = ref();
const bankFileRef = ref();
const cardFileRef = ref();
const assignUser = ref();

const loading = ref(false);

const defaultFormData ={
  id: null,
  applicationType: "Labour Importation Scheme for the Construction Sector Application Form",
  internalStatus: 0,
  applicationNo: "",
  contractorName: "",
  address: "",
  certificateNo: "",
  incorporationNo: "",
  personInChargeName: "",
  personInChargeTitle: "",
  telNo: "",
  email: "",
  faxNo: "",
  previousApplicationNo1: "",
  previousApplicationNo2: "",
  previousApplicationNo3: "",
  contractNo: "",
  contractName: "",
  workSite: "",
  commencementDate: "",
  targetCompletionDate: "",
  contractValue: "",
  contactPersonDO: "",
  contactPersonDOTelEmail: "",
  reasonsImportationLabour: "",
  specialTradesContracts: "",
  specialConsiderationReason: "",
  residentialDevelopmentContracts: "",
  commercialDevelopmentContracts: "",
  applicantId: "",
  completenessComment: "",
  history: []
}

const form = ref(defaultFormData);


const rules = ref({
  contractorName: {
    required: true,
    message: "Please input Name of Principal Contractor",
    trigger: "blur",
  },
  address: {
    required: true,
    message: "Please input Address",
    trigger: "blur",
  },
  certificateNo: {
    required: true,
    message: "Please input Business Registration Certificate no.",
    trigger: "blur",
  },
  incorporationNo: {
    required: true,
    message: "Please input Certificate of Incorporation no.",
    trigger: "blur",
  },
  personInChargeName: {
    required: true,
    message: "Please input Name of the person-in-charge",
    trigger: "blur",
  },
  personInChargeTitle: {
    required: true,
    message: "Please input Post title of the personin-charge",
    trigger: "blur",
  },
  email: {
    required: true,
    message: "Please input Email",
    trigger: "blur",
  },
  telNo: {
    required: true,
    message: "Please input Post title of the Tel. no.",
    trigger: "blur",
  },
  faxNo: {
    required: true,
    message: "Please input Post title of the Fax no.",
    trigger: "blur",
  },
  previousApplicationNo1: {
    required: true,
    message: "Please input Application No. 1",
    trigger: "blur",
  },
  previousApplicationNo2: {
    required: true,
    message: "Please input Application No. 2",
    trigger: "blur",
  },
  previousApplicationNo3: {
    required: true,
    message: "Please input Application No. 3",
    trigger: "blur",
  },
  contractNo: {
    required: true,
    message: "Please input Contract no.",
    trigger: "blur",
  },
  contractName: {
    required: true,
    message: "Please input Name of the contract",
    trigger: "blur",
  },
  workSite: {
    required: true,
    message: "Work site",
    trigger: "blur",
  },
  commencementDate: {
    required: true,
    message: "Please input Commencement date",
    trigger: "blur",
  },
  targetCompletionDate: {
    required: true,
    message: "Please input Target completion date",
    trigger: "blur",
  },
  contractValue: {
    required: true,
    message: "Please input Value of the contract",
    trigger: "blur",
  },
  contactPersonDO: {
    required: true,
    message: "Please input Person of relevant Works Department/organisation",
    trigger: "blur",
  },
  contactPersonDOTelEmail: {
    required: true,
    message: "Please input Person of relevant Works Department/organisation",
    trigger: "blur",
  },
  reasonsImportationLabour: {
    required: true,
    message: "Please input provide reasons(s) for importation of labour",
    trigger: "blur",
  },
  labourReasons: {
    required: true,
    message: "Please input reasons(s) for importation of labour",
    trigger: "blur",
  },
  specialTradesContracts: {
    required: true,
    message: "Please input contracts involving construction labour of special trades/disciplines4",
    trigger: "blur",
  },
  specialConsiderationReason: {
    required: true,
    message: "Please input Reason(s) for importation of labour and other exceptional circumstances warranting special consideration",
    trigger: "blur",
  },
  residentialDevelopmentContracts: {
    required: true,
    message: "Please input Residential development contracts",
    trigger: "blur",
  },
  commercialDevelopmentContracts: {
    required: true,
    message: "Please input Commercial development contracts",
    trigger: "blur",
  },
});

let options = ref([]);
let bankList = ref([]);
const formRef = ref();
const status = ref("");

const areaOptions = computed(() => {
  return [
    {
      label: "Hong Kong",
      value: "1",
    },
    {
      label: "Kowloon",
      value: "2",
    },
    {
      label: "New Territories",
      value: "3",
    },
  ];
});

onMounted(async() => {
 await initData();
});

onActivated(async() => {
  await initData();
});

const initData = async()=> {
  getBank();
  getJobNature();
  // if(props.currentApplicationId) history.state.applicationId = props.currentApplicationId;
  if (history.state.applicationId) {
    applicationId.value = history.state.applicationId;
    emit("changeIsSaved", true, applicationId.value);
    getApplicantInfo(applicationId.value);
    getUploadedDocFunction(applicationId.value);
  }
  form.value.applicationType = type.value;
}

watch(applicationType, (newV) => {
  status.value = newV;
});

const getBank = async () => {
  bankList.value = [];
};

async function getJobNature() {
  options.value = [];
}

const clickButton = (type) => {
  formRef.value
    .validate()
    .then(() => {
      if(['save', 'submit'].includes(type)){
        handleSave(type);
      }else if(['approval', 'reject', 'vetting'].includes(type)){
        handleApproval(type);
      }else if(type == 'assign'){
        handleAssign();
      }else if(type == 'comment'){
        handleComment();
      }
    })
    .catch(() => {
      console.log("error");
    });
};

const handleSave = async (type) => {
  for(let elem of Object.keys(form.value)){
    console.log(elem + ": ");
    console.log(form.value[elem]);
  }
  try {
    const params = common.filterDBCol(form.value);

    const { code, data, message } =
      type === "save"
        ? await saveNewApplication(params)
        : await submitNewApplication(params);
    if (code === 200) {
      ElMessage.success(message);
      type === "save" && (applicationId.value = data.applicationId);
      type === "save" && getApplicantInfo(data?.applicationId);
      emit(
        "getApplicationInfoFunction",
        data.applicationId || applicationId.value
      );
      type === "save" && emit("changeIsSaved", true, data.applicationId);
      router.back();
    } else ElMessage.error(message);
  } catch (e) {
    ElMessage.error('message');
    console.log(e);
  }
};
const getApplicantInfo = async (params) => {
  try {
    loading.value = true;
    const { code, data, message } =
      await getPersonalInfoByApplicationId(params);
    if (code === 200) {
      form.value = { ...form.value, ...data };

      if(data.specialTradesContracts)
        specialTradesContractsChbx.value = true;
      if(data.specialConsiderationReason)
        specialConsiderationReasonChbx.value = true;
      if(data.residentialDevelopmentContracts)
        residentialDevelopmentContractsChbx.value = true;
      if(data.commercialDevelopmentContracts)
      commercialDevelopmentContractsChbx.value = true;

      if (history.state.applicationId)
        emit(
          "changeType",
          data.applicationCategory === "M" ? "Maritime" : "Aviation"
        );
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const getApplicantInfoByApplicantIdFunction = async () => {
  try {
    loading.value = true;
    const { code, data, message } = await getPersonalInfoByApplicantId(
      history.state.applicantId
    );
    if (code === 200) {
      const { address = {}, applicant = {}, employment = {} } = data;
      form.value = { ...form.value, ...address, ...applicant, ...employment };
      form.value.hkicNumber = applicant.hkicNumber.split("(")[0];
      form.value.number = applicant.hkicNumber.split("(")[1]?.split(")")[0];
      form.value.jobNature =
        employment.jobNature !== ""
          ? employment.jobNature?.split(",").map((item) => item * 1)
          : [];
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const getUploadedDocFunction = async (params) => {
  try {
    loading.value = true;
    const { code, data, message } = await getUploadedDoc(params);
    if (code === 200) {
      hkicFileList.value = data.filter((item) => item.docType === 0);
      bankFileList.value = data.filter((item) => item.docType === 1);
      employmentFileList.value = data.filter((item) => item.docType === 4);
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

function requestUpload(fileInfo, type) {
  const size = type === "card" ? 2 : 5;
  if (fileInfo.size >= size * 1024 * 1024) {
    ElMessage.warning(t("message.uploadTip", { size: size }));
    return;
  }
  let fileData = new FormData();
  fileData.append("file", fileInfo.file);
  fileData.append("applicationId", applicationId.value);
  fileData.append(
    "nameEng",
    form.value.engSurname + " " + form.value.engGivenName
  );
  type === "card"
    ? uploadHkic(fileData)
    : type === "employment"
      ? uploadEmployment(fileData)
      : uploadBank(fileData);
}

async function uploadHkic(fileData) {
  try {
    let { code, message, data } = true
      ? await saveHkic(fileData)
      : await modifyHkic(fileData);
    if (code === 200) {
      hkicFileList.value.push({ filename: data.fileName });
      ElMessage.success(message);
    } else ElMessage.error(message);
  } catch (err) {
    console.log(err);
  }
}

async function uploadEmployment(fileData) {
  try {
    let { code, message, data } =
      employmentFileList.value.length === 0
        ? await saveEmploymentProof(fileData)
        : await modifyEmploymentProof(fileData);
    if (code === 200) {
      employmentFileList.value.push({ filename: data.fileName });
      ElMessage.success(message);
    } else ElMessage.error(message);
  } catch (err) {
    console.log(err);
  }
}

async function uploadBank(params) {
  try {
    let { code, message, data } =
      bankFileList.value.length === 0
        ? await saveBankProof(params)
        : await modifyBankProof(params);
    if (code === 200) {
      bankFileList.value.push({ filename: data.fileName });
      ElMessage.success(message);
    } else ElMessage.error(message);
  } catch (err) {
    console.log(err);
  }
}

const changeBank = () => {
  form.value.bankPreview =
    bankList.value.find((item) => item.bankId === form.value.bankId)?.bankCode +
    form.value.bankAccount;
};

const clickCancel = () => {
  form.value = defaultFormData;
  router.back();
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
            applicationId: arr[0].applicationId || applicationId.value,
            fileName: arr[0].filename,
          });
    if (code === 200) {
      getUploadedDocFunction(applicationId.value);
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
};

const selectDetail = (value, name)=>{
  if(value == false){
    form.value[name] = '';
  }
}

const handleApproval = async(type)=>{
  let params = {};
  if(type != 'reject'){
    params = {
      internalStatus: form.value.internalStatus + 1,
      applicationId: form.value.applicationId
    };
  }else{
    params = {
      internalStatus: 10,
      applicationId: form.value.applicationId
    };
  }
  let { code, data, message } = await approvalAndRejectForm(params);
  if (code === 200) {
    router.back();
  } else ElMessage.error(message);
}

const handleAssign = async()=>{
  if(assignUser.value){
    let params = {
      internalStatus: form.value.internalStatus + 1,
      applicationId: form.value.applicationId
    };
    let { code, data, message } = await approvalAndRejectForm(params);
    if (code === 200) {
      router.back();
    }
  }else ElMessage.error("Please select user");
}

const handleComment = async()=>{
  console.log(form.value.completenessComment);
  if(form.value.completenessComment){
    let params = {
      completenessComment: form.value.completenessComment,
      applicationId: form.value.applicationId
    };
    let { code, data, message } = await completenessCommentForm(params);
    if (code === 200) {
      router.back();
    }
  }else ElMessage.error("Please input Comment");
}

const autoFill = ()=>{
  console.log(form);
  const params = common.filterDBCol(form.value);
  let i=1;
  specialTradesContractsChbx.value = true;
  specialConsiderationReasonChbx.value = true;
  residentialDevelopmentContractsChbx.value = true;
  commercialDevelopmentContractsChbx.value = true;
  for(let elem of Object.keys(params)){
    if (!["applicantId", "applicationId"].includes(elem)) form.value[elem] = i + "";
    i++;
  }

  form.value.internalStatus = 0;
  form.value.isOperatingLicenseValid = false;
  form.value.applicationType = "Labour Importation Scheme for the Construction Sector Application Form";
  form.value.contractValue = "HK$1 billion or more";
  form.value.commencementDate = new Date().toISOString().slice(0,10);
  form.value.targetCompletionDate = new Date().toISOString().slice(0,10);
  event.preventDefault();
}
</script>

<style lang="scss" scoped></style>
