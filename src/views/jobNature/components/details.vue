<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Job Nature - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Label (Chinese)" prop="descChi" required>
            <tiny-input v-model="formData.descChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Label (English)" prop="descEng" required>
            <tiny-input v-model="formData.descEng" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Category" prop="category" required>
            <tiny-input v-model="formData.category" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Trigger Field" prop="triggerField" required>
            <tiny-input v-model="formData.triggerField" />
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
import {
  addJobNature,
  updateJobNature,
  getJobNatureDetails,
} from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
const formData = ref({
  descChi: "",
  descEng: "",
  category: "",
  triggerField: "",
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
    let { code, data, message } = await getJobNatureDetails(
      route.query.natureId
    );
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
      const params = { ...formData.value };
      let { code, data, message } = await addJobNature(params);
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
        natureId: route.query.natureId,
      };
      let { code, data, message } = await updateJobNature(params);
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
