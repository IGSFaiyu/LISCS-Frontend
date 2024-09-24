<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">General Setting</span>
      <el-button type="primary" @click="handleSave">Save</el-button>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item
            label="Max. claim amount per applicant (HKD)"
            prop="claimableAmount"
            required
          >
            <tiny-input v-model="formData.claimableAmount" type="number"/>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item
            label="Retention period (year)"
            prop="retentionPeriod"
            required
          >
            <tiny-input v-model="formData.retentionPeriod" type="number" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item
            label="Enquiry mailbox"
            prop="receivingEmail"
            required
          >
            <tiny-input v-model="formData.receivingEmail" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item
            label="OTP Expiry (second)"
            prop="otpExpiryPeriod"
            required
          >
            <tiny-input v-model="formData.otpExpiryPeriod" type="number"/>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onActivated } from "vue";
import { useRoute } from "vue-router";
import {
  Row as TinyRow,
  Col as TinyCol,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Switch as TinySwitch,
  Select as TinySelect,
  Option as TinyOption,
  DatePicker as TinyDatePicker,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { updateProArea, getSettingDetails, updateSetting, getSettingList } from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
let formData = ref({
  claimableAmount: "",
  retentionPeriod: "",
  receivingEmail: "",
  otpExpiryPeriod: "",
});

onActivated(async () => {
  getDetails();
});

async function getDetails() {
  try {
    const params = {};
    let { code, data, message } = await getSettingList();
    if (code === 200) {
      formData.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleSave() {
  handleInfo();
}

async function handleInfo() {
  try {
    const params = { ...formData.value };
    let { code, data, message } = await updateSetting(params);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}
</script>
