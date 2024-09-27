<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Quota Management</span>
      <el-button type="primary" @click="handleSave">Save</el-button>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Can use total quota" prop="totalQuota" required>
            <el-input v-model="formData.totalQuota" type="number" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Quarter 1" prop="quarter1Date" required>
            <tiny-date-picker
              v-model="formData.quarter1Date"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              range-separator="To"
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Quarter 2" prop="quarter2Date" required>
            <tiny-date-picker
              v-model="formData.quarter2Date"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              range-separator="To"
            />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Quarter 3" prop="quarter3Date" required>
            <tiny-date-picker
              v-model="formData.quarter3Date"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              range-separator="To"
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Quarter 4" prop="quarter4Date" required>
            <tiny-date-picker
              v-model="formData.quarter4Date"
              type="daterange"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              range-separator="To"
            />
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
import {
  updateProArea,
  getSettingDetails,
  updateSetting,
  getSettingList,
} from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();
const title = ref("");
const ruleFormRef = ref();

const rules = ref({
  quarter1Date: {
    required: true,
    message: "Please input quarter1 date",
    trigger: "blur",
  },
  quarter2Date: {
    required: true,
    message: "Please input quarter2 date",
    trigger: "blur",
  },
  quarter3Date: {
    required: true,
    message: "Please input quarter3 date",
    trigger: "blur",
  },
  quarter4Date: {
    required: true,
    message: "Please input quarter4 date",
    trigger: "blur",
  },
  totalQuota: {
    required: true,
    message: "Please input total quota",
    trigger: "blur",
  },
});

const formData = ref({
  quarter1Date: null,
  quarter2Date: null,
  quarter3Date: null,
  quarter4Date: null,
  totalQuota: 12000,
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
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      handleInfo();
    } else {
      ElMessage.error('Please Input');
    }
  })
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
