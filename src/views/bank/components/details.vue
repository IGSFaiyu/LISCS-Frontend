<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Bank - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Name (Chinese)" prop="nameChi" required>
            <tiny-input v-model="formData.nameChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Name (English)" prop="nameEng" required>
            <tiny-input v-model="formData.nameEng" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Bank Code" prop="bankCode" required>
            <tiny-input
              v-model="formData.bankCode"
              :maxlength="3"
              show-word-limit
            />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, reactive } from "vue";
import { useRoute } from "vue-router";
import {
  Row as TinyRow,
  Col as TinyCol,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
} from "@opentiny/vue";
import router from "@/router";
import { addBank, updateBank, getBankDetails } from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
let formData = ref({
  nameChi: "",
  nameEng: "",
  bankCode: "",
  createdBy: 0,
});

onActivated(async () => {
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getBankDetails(route.query.bankId);
    if (code === 200) {
      formData.value = { ...data };
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleCancel() {
  router.go(-1);
}
async function handleSave() {
  ruleFormRef.value
    .validate()
    .then(() => {
      handleInfo();
    })
    .catch(() => {
      ElMessage.warning("Error Submit");
    });
}

async function handleInfo() {
  if (title.value === "Create") {
    try {
      const params = {
        ...formData.value,
        createdBy: 0,
      };
      let { code, data, message } = await addBank(params);
      if (code === 200) {
        ElMessage.success(message);
        router.go(-1);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const params = {
        ...formData.value,
        bankId: route.query.bankId,
      };
      let { code, data, message } = await updateBank(params);
      if (code === 200) {
        ElMessage.success(message);
        router.go(-1);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
