<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Course Module - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Module Title (Chinese)" prop="titleChi">
            <tiny-input v-model="formData.titleChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item
            label="Module Title (English)"
            prop="titleEng"
            required
          >
            <tiny-input v-model="formData.titleEng" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item
            label="Course / Examination Effective From"
            prop="effectiveFrom"
            required
          >
            <tiny-date-picker
              v-model="formData.effectiveFrom"
              placeholder="please select"
              value-format="yyyy-MM-ddTHH:mm:ss"
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item
            label="Course / Examination Effective End"
            prop="effectiveTo"
          >
            <tiny-date-picker
              v-model="formData.effectiveTo"
              placeholder="please select"
              value-format="yyyy-MM-ddTHH:mm:ss"
            />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Currency" prop="currencyCode">
            <tiny-select
              v-model="formData.currencyCode"
              placeholder="please select"
            >
              <tiny-option
                v-for="item in currencyOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Fee" prop="fee">
            <tiny-input v-model="formData.fee" type="number" />
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
  Select as TinySelect,
  Option as TinyOption,
  DatePicker as TinyDatePicker,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import {
  getCurrencyList,
  getCourseProList,
  addModule,
  updateModule,
  getModuleDetails,
} from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();

let formData = ref({
  moduleId: "",
  courseId: "",
  titleEng: "",
  titleChi: "",
  effectiveFrom: "",
  effectiveTo: "",
  currencyCode: "",
  fee: "",
});

const currencyOpt = ref([
  {
    label: "HKD",
    value: "hkd",
  },
]);

onActivated(async () => {
  getCurrencyOptList();
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getModuleDetails(route.query.moduleId);
    if (code === 200) {
      formData.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleCancel() {
  router.go(-1);
  resetForm();
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

async function getCurrencyOptList() {
  try {
    let { code, data, message } = await getCurrencyList();
    if (code === 200) {
      currencyOpt.value = data.content.map((element) => {
        return {
          label: element.descEng + "(" + element.descChi + ")",
          value: element.currencyCode,
        };
      });
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function handleInfo() {
  if (title.value === "Create") {
    try {
      const params = {
        ...formData.value,
        courseId: route.query.courseId,
      };
      let { code, data, message } = await addModule(params);
      if (code === 200) {
        router.go(-1);
        resetForm();
        ElMessage.success(message);
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
        moduleId: route.query.moduleId,
      };
      let { code, data, message } = await updateModule(params);
      if (code === 200) {
        ElMessage.success(message);
        router.go(-1);
        resetForm();
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function resetForm() {
  formData.value = {
    moduleId: "",
    courseId: "",
    titleEng: "",
    titleChi: "",
    effectiveFrom: "",
    effectiveTo: "",
    currencyCode: "",
    fee: "",
  };
}
</script>
