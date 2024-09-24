<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Case Enquitry Category - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Label (English)" prop="descEng" required>
            <tiny-input v-model="formData.descEng" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Label (Chinese)" prop="descChi" required>
            <tiny-input v-model="formData.descChi" />
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
  Switch as TinySwitch,
} from "@opentiny/vue";
import router from "@/router";
import {
  addEnCategory,
  updateEnCategory,
  getEnCategoryDetails,
} from "@/api/index";
import { ElMessage } from "element-plus";
const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
const formData = ref({
  descChi: "",
  descEng: "",
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
    let { code, data, message } = await getEnCategoryDetails(
      route.query.categoryId
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
function handleSave() {
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
      let { code, data, message } = await addEnCategory(params);
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
        categoryId: route.query.categoryId,
      };
      let { code, data, message } = await updateEnCategory(params);
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
