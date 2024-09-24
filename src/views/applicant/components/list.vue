<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">A. Personal Particulars</span>
    </div>
    <div style="margin-top: 10px">
      <el-form ref="baseFormRef" :model="baseForm" :rules="baseRules" label-position="top" class="custom-form">
        <div style="display: contents;">
          <el-form-item
            class="custom-form-flex"
            label="Hong Kong Identity Card Number"
            prop="cardNumber"
          >
            <div style="display: flex; height: 100%; width: 98%">
              <el-input v-model="baseForm.hkicNumber"></el-input>
              <div
                style="
                  width: 20%;
                  display: flex;
                  align-items: center;
                  margin-left: 5px;
                  font-size: 1rem
                "
              >
                <span>(</span>
                <el-input v-model="baseForm.number" style="width: 560%; margin: 0 5px"></el-input>
                <span>)</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="Title" prop="title">
            <el-select v-model="baseForm.title" style="width: 100%">
              <el-option label="Mr." value="Mr" />
              <el-option label="Ms." value="Ms" />
              <el-option label="Miss." value="Miss" />
            </el-select>
          </el-form-item>
          <el-form-item label="Surname in Chinese" prop="chiSurname">
            <el-input v-model="baseForm.chiSurname" />
          </el-form-item>
          <el-form-item label="Given Names in Chinese" prop="chiGivenName">
            <el-input v-model="baseForm.chiGivenName" />
          </el-form-item>
          <el-form-item label="Surname in English" prop="engSurname">
            <el-input v-model="baseForm.engSurname" />
          </el-form-item>
          <el-form-item label="Given Names in English" prop="engGivenName">
            <el-input v-model="baseForm.engGivenName" />
          </el-form-item>
          <el-form-item label="Gender" prop="gender">
            <el-select v-model="baseForm.gender" style="width: 100%">
              <el-option label="Male" value="M" />
              <el-option label="Female" value="F" />
            </el-select>
          </el-form-item>
          <el-form-item label="Personal Local Mobile Phone Number" prop="phoneNumber">
            <el-input v-model="baseForm.phoneNumber" />
          </el-form-item>
          <el-form-item label="Email Address" prop="email">
            <el-input v-model="baseForm.email" />
          </el-form-item>
          <el-form-item label="Preferred Language for Notification" prop="language">
            <el-select v-model="baseForm.language" style="width: 100%">
              <el-option label="English" value="en" />
              <el-option label="繁體中文" value="zh-TW" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="custom-form">
        <div style="display: contents;">
          <div class="cord-address">Correspondence Address (Last Applicatrion)</div>
          <div style="display: contents;">
            <el-row :gutter="20" style="width: 50%;">
              <el-col :span="8">
                <el-form-item label="Flat" prop="flat" style="width: 100%;">
                  <el-input v-model="form.flat" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Floor" prop="floor" style="width: 100%;">
                  <el-input v-model="form.floor" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Block" prop="block" style="width: 100%;">
                  <el-input v-model="form.block" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Name of Building" prop="buildingName" style="margin-left: 10px;">
              <el-input v-model="form.buildingName" disabled />
            </el-form-item>
          </div>
          <el-form-item label="Estate/Court" prop="estateName" style="width: 32%;">
            <el-input v-model="form.estateName" disabled />
          </el-form-item>
          <el-form-item label="No. & Name of Street" prop="street" style="width: 32%;">
            <el-input v-model="form.street" disabled />
          </el-form-item>
          <el-form-item label="District" prop="district" style="width: 32%;">
            <el-input v-model="form.district" disabled />
          </el-form-item>
          <el-form-item label="Region" prop="area" style="width: 32%">
            <el-select v-model="form.area" placeholder=" " disabled>
              <el-option
                v-for="item in areaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div class="page-title" style="width: 100%;">
            <span class="title">B. Current Employment Information (Last Application)</span>
          </div>
          <el-form-item label="Company Name" prop="companyName" style="width: 33%;">
            <el-input v-model="form.companyName" disabled />
          </el-form-item>
          <el-form-item label="Position" prop="position" style="width: 33%;">
            <el-input v-model="form.position" disabled />
          </el-form-item>
          <el-form-item label="Year / Month of Joining" prop="joinDate" style="width: 33%;">
            <el-input v-model="form.joinDate" disabled />
          </el-form-item>
          <el-form-item label="Job Nature" prop="jobNature" style="width: 100%;">
            <el-select v-model="form.jobNature" multiple disabled style="width: 100%">
              <el-option
                v-for="item in jobNaturesOptions"
                :key="item.natureId"
                :label="item.descChi"
                :value="item.natureId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Registration Book No." prop="registrationBookNo" style="width: 33%;">
            <el-input v-model="form.registrationBookNo" disabled />
          </el-form-item>
          <el-form-item label="Cert of Ownership No." prop="certOfOwnershipNo" style="width: 33%;">
            <el-input v-model="form.certOfOwnershipNo" disabled />
          </el-form-item>
          <el-form-item
            label="Is operating license valid"
            prop="isOperatingLicenseValid"
            style="width: 33%; padding-left: 10px;"
          >
            <el-radio-group v-model="form.isOperatingLicenseValid">
              <el-radio :value="true">Yes</el-radio>
              <el-radio :value="false">No</el-radio>
              <el-radio value="N/A">N/A</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="Company Backgound Check"
            prop="companyBackgroundCheck"
            style="width: 33%;"
          >
            <el-radio-group v-model="form.companyBackgroundCheck">
              <el-radio :value="true">Yes</el-radio>
              <el-radio :value="false">No</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="If no,please specify"
            prop="companyBackgroundCheckOther"
            style="width: 33%;"
          >
            <el-input v-model="form.companyBackgroundCheckOther" disabled />
          </el-form-item>
          <el-form-item style="width: 33%;" />
        </div>
      </el-form>
      <div style="display: flex; text-align: center; margin-top: 50px;justify-content: right;">
        <el-button type="danger" @click="handleTip('changePwd')">Reset Password</el-button>
        <el-button type="danger" @click="handleTip('unclock')">Unlock</el-button>
        <el-button type="danger" @click="handleNew">Create New Application</el-button>
        <el-button type="primary" @click="onSubmit">Save</el-button>
        <el-button @click="goBack">Back</el-button>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="500" :show-close="false">
      <span>{{ tipType === 'changePwd' ? 'Password will be changed' : 'Application will be unlocked' }}.Are you sure to continue?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="psdVisible" title="Change Password" width="500" :show-close="false">
      <el-form :model="passwordForm">
        <el-form-item label="Password">
          <el-input v-model="passwordForm.password" placeholder=" " disabled style="width: 80%;" />
          <el-button style="width: 20%;" @click="handleGenerate">Generate</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="psdVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleChangePsw">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import router from "@/router";
import {
  getApplicantDetails,
  updateApplicant,
  unlockApplicant,
  changePassword,
  getJobNatureList,
} from "@/api/index";
import {
  validateRequired,
  validateEmail,
  validateMobile,
  validateHKIDUtil,
} from "@/utils/validate.ts";
import { timestampToTime } from "@/utils/formatTime.js";

const props = defineProps({
  applicantId: {
    type: String,
  },
});

const formRef = ref();
const baseFormRef = ref()
let baseForm = ref({
  title: "Mr",
  hkicNumber: "",
  email: "",
  phoneNumber: "",
  password: "",
  chiSurname: "",
  chiGivenName: "",
  engSurname: "",
  engGivenName: "",
  gender: "M",
  number: "",
});
let form = ref({
  jobNature: [],
});
const passwordForm = ref({
  password: "",
});
const areaOptions = ref([]);
const jobNaturesOptions = ref([]);
const validateNumber = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z]+$/;
  if (baseForm.value.hkicNumber && baseForm.value.number) {
    let value = form.value.hkicNumber  + form.value.number ;
    validateHKIDUtil(value, callback)
  } else {
    callback(new Error("required"));
  }
};
const baseRules = ref({
  cardNumber: { required: true, validator: validateNumber, trigger: "blur" },
  email: [
    { required: true, validator: validateRequired, trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  phoneNumber: [
    { required: true, validator: validateRequired, trigger: "blur" },
    { validator: validateMobile, trigger: "blur" },
  ],
  title: { required: true, validator: validateRequired, trigger: "change" },
  gender: { required: true, validator: validateRequired, trigger: "change" },
  engGivenName: {
    required: true,
    validator: validateRequired,
    trigger: "blur",
  },
  engSurname: { required: true, validator: validateRequired, trigger: "blur" },
  language: { required: true, validator: validateRequired, trigger: "change" },
});
const tipType = ref("");
const dialogVisible = ref(false);
const psdVisible = ref(false);

watch(
  props,
  (val) => {
    if (val.applicantId) {
      getData();
      getJobNature();
    }
  },
  { deep: true, immediate: true }
);

async function getJobNature() {
  try {
    let params = {
      page: 0,
      size: 999,
      sortColumn: "natureId",
      sortOrder: 0,
    };
    let { code, data, message } = await getJobNatureList(params);
    if (code === 200) {
      jobNaturesOptions.value = data.content;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getData() {
  try {
    let { code, message, data } = await getApplicantDetails(props.applicantId);
    if (code === 200) {
      form.value = Object.assign(
        {},
        data.address,
        data.employment
      );
      baseForm.value = { ...data.applicant }
      const startIndex = data.applicant.hkicNumber.indexOf("(") + 1;
      const endIndex = data.applicant.hkicNumber.indexOf(")");
      baseForm.value.hkicNumber = data.applicant.hkicNumber.split("(")[0];
      baseForm.value.number = data.applicant.hkicNumber.slice(startIndex, endIndex);
      form.value.joinDate = data.employment.joinDate
        ? timestampToTime(data.employment.joinDate, "YYYY-MM")
        : "";
      form.value.jobNature = data.employment.jobNature
        ?.split(",")
        .map((numStr) => parseInt(numStr, 10));
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleTip(type) {
  tipType.value = type;
  dialogVisible.value = true;
}

function handleConfirm() {
  dialogVisible.value = false;
  if (tipType.value === "changePwd") {
    psdVisible.value = true;
  } else {
    handleLock();
  }
}

async function handleLock() {
  try {
    let { code, message } = await unlockApplicant({
      applicantId: props.applicantId,
    });
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleGenerate() {
  // 生成密碼： 8位，upper and lower case alphabets, numbers and special characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  passwordForm.value.password = result;
}

async function handleChangePsw() {
  if (!passwordForm.value.password) {
    ElMessage.warning('Error Submit');
    return
  }
  try {
    let { code, message } = await changePassword({
      applicantId: props.applicantId,
      password: passwordForm.value.password
    });
    if (code === 200) {
      ElMessage.success(message);
      psdVisible.value = false;
      passwordForm.value.password = ''
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function onSubmit() {
  baseFormRef.value
    .validate()
    .then(() => {
      handleInfo();
    })
    .catch(() => {
      ElMessage.warning("Error Submit");
    });
}
async function handleInfo() {
  try {
    const result = {}
    for (const item in baseForm) {
      if (item !== 'hkicNumber' && item !== 'number') result[item] = baseForm[item]
    }
    const params = result._value
    params.hkicNumber = baseForm.value.hkicNumber + '(' + baseForm.value.number + ')'
    params.applicantId = props.applicantId;
    params.loginAttempt = 0;
    params.approvedAmount = 0;
    params.locked = true;
    delete params.number
    let { code, message } = await updateApplicant(params);
    if (code === 200) {
      ElMessage.success(message);
      getData();
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}
function goBack() {
  router.go(-1);
}

const handleNew = ()=>{
  router.push({
    path: "/newApplications",
    state: {
      applicantId: props.applicantId,
    },
  });
}
</script>

<style lang="scss">
.cord-address {
  width: 100%;
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 500;
  color: #606266;
  margin-top: 100px;
}
.custom-form {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .el-form-item {
    margin: 10px 0 0 0;
    width: 48%;

    .el-form-item__label {
      font-size: 1rem;
      font-weight: 500;
      text-align: left;
      line-height: 1.5rem;
    }

    .el-form-item__content {
      height: 3rem;
      border-radius: 4px;
      height: fit-content;

      .el-input,
      .el-input__wrapper,
      .el-input__inner,
      .el-select,
      .el-select__wrapper {
        padding: 0 !important;
        border: none !important;
        font-size: 1rem;
        font-weight: 400;
        line-height: 2rem;
        letter-spacing: 0.5px;
        text-align: left;
        height: 100%;
        box-shadow: none !important;
      }

      .el-input__inner,
      .el-select__wrapper {
        padding: 0.5rem !important;
        background-color: #f5f7fa !important;
        box-shadow: none !important;
        height: fit-content;
      }
    }
  }
}
</style>
