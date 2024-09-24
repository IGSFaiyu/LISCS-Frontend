<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Applicant Information</span>
    </div>
    <div style="margin-top: 10px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="custom-form">
        <div style="display: contents">
          <el-form-item
            class="custom-form-flex"
            label="Hong Kong Identity Card Number"
            prop="cardNumber"
          >
            <div style="display: flex; height: 100%; width: 98%">
              <el-input v-model="form.hkicNumber"></el-input>
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
                <el-input v-model="form.number" style="width: 560%; margin: 0 5px"></el-input>
                <span>)</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="Title" prop="title">
            <el-select v-model="form.title" style="width: 100%">
              <el-option label="Mr." value="Mr" />
              <el-option label="Ms." value="Ms" />
              <el-option label="Miss." value="Miss" />
            </el-select>
          </el-form-item>
          <el-form-item label="Surname in Chinese" prop="surnameChi">
            <el-input v-model="form.surnameChi" />
          </el-form-item>
          <el-form-item label="Given Names in Chinese" prop="givennameChi">
            <el-input v-model="form.givennameChi" />
          </el-form-item>
          <el-form-item label="Surname in English" prop="surnameEng">
            <el-input v-model="form.surnameEng" />
          </el-form-item>
          <el-form-item label="Given Names in English" prop="givennameEng">
            <el-input v-model="form.givennameEng" />
          </el-form-item>
          <el-form-item label="Gender" prop="gender">
            <el-select v-model="form.gender" style="width: 100%">
              <el-option label="Male" value="M" />
              <el-option label="Female" value="F" />
            </el-select>
          </el-form-item>
          <el-form-item label="Personal Local Mobile Phone Number" prop="tel">
            <el-input v-model="form.tel" />
          </el-form-item>
          <el-form-item label="Email Address" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item />
          <el-form-item
            label="Password (Please mark down the generated password as it will notbe retrievable after save)"
            prop="password"
          >
            <el-input v-model="form.password" disabled style="width: 80%;" />
            <el-button style="height: 48px; width: 20%;" @click="handleGenerate">Generate</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="display: flex; text-align: center; margin-top: 20px;justify-content: right;">
        <el-button type="primary" @click="onSubmit">Save</el-button>
        <el-button @click="goBack">cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import router from "@/router";
import { addApplicant } from "@/api/index";
import {
  validateRequired,
  validateEmail,
  validateMobile,
  validateHKIDUtil,
} from "@/utils/validate.ts";

const formRef = ref();
const form = reactive({
  title: "Mr",
  hkicNumber: "",
  email: "",
  tel: "",
  password: "",
  surnameChi: "",
  givennameChi: "",
  surnameEng: "",
  givennameEng: "",
  gender: "M",
  number: "",
});
const validateNumber = (rule, value, callback) => {
  var reg = /^[0-9a-zA-Z]+$/;
  if (form.hkicNumber && form.number) {
    let value = form.hkicNumber  + form.number ;
    validateHKIDUtil(value, callback)
  } else {
    callback(new Error('required'));
  }
};
const rules = ref({
  cardNumber: { required: true, validator: validateNumber, trigger: "blur" },
  email: [
    { required: true, validator: validateRequired, trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  tel: [
    { required: true, validator: validateRequired, trigger: "blur" },
    { validator: validateMobile, trigger: "blur" },
  ],
  password: {
    required: true,
    validator: validateRequired,
    trigger: "blur",
  },
  title: { required: true, validator: validateRequired, trigger: "change" },
  gender: { required: true, validator: validateRequired, trigger: "change" },
  givennameEng: {
    required: true,
    validator: validateRequired,
    trigger: "blur",
  },
  surnameEng: { required: true, validator: validateRequired, trigger: "blur" },
});

function handleGenerate() {
  // 生成密碼： 8位，upper and lower case alphabets, numbers and special characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  form.password = result;
}

function onSubmit() {
  formRef.value
    .validate()
    .then(() => {
      handleInfo();
    })
    .catch(() => {
      ElMessage.warning('Error Submit');
    });
}
async function handleInfo() {
  try {
    const params = {};
    for (const item in form) {
      if (item !== "hkicNumber" && item !== "number") params[item] = form[item];
    }
    params.hkicNumber = form.hkicNumber + "(" + form.number + ")";
    delete params.number
    let { code, message } = await addApplicant(params);
    if (code === 200) {
      ElMessage.success(message);
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
</script>

<style lang="scss">
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
