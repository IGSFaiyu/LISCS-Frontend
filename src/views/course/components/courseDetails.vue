<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Course - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Category" prop="category" required>
            <tiny-select
              v-model="formData.category"
              placeholder="please select"
            >
              <tiny-option
                v-for="item in categoryOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Course Provider" prop="providerId" required>
            <tiny-select
              v-model="formData.providerId"
              placeholder="please select"
            >
              <tiny-option
                v-for="item in providerOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item
            label="MATF Course / Examination Code"
            prop="courseCode"
            required
          >
            <tiny-input v-model="formData.courseCode" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item
            label="Course / Examination Title (Chinese)"
            prop="titleChi"
          >
            <tiny-input v-model="formData.titleChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item
            label="Course / Examination Title (English)"
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
          <tiny-form-item
            label="Currency"
            prop="currencyCode"
            :required="tableData.length < 1"
          >
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
    <div v-if="title === 'Update'">
      <div class="page-title">
        <span class="title">Module</span>
        <el-button type="primary" @click="handleModuleAdd"
          >Create New</el-button
        >
      </div>
      <tiny-grid :data="tableData">
        <tiny-grid-column
          v-for="(item, index) in columns"
          :field="item.value"
          :title="item.title"
          :key="index"
        />
        <tiny-grid-column title="Action" align="center" width="100">
          <template #default="data">
            <div>
              <span style="cursor: pointer" @click="handleModuleEdit(data.row)">
                <img src="@/assets/images/edit.png" />
              </span>
              <span>
                <confirm-delete
                  :data="data"
                  @delete-method="handleModuleDelete(data.row)"
                />
              </span>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
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
  addCourse,
  updateCourse,
  getCourseDetails,
  getModuleList,
  deleteModule,
} from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();

let formData = ref({
  category: "",
  providerId: "",
  courseCode: "",
  titleChi: "",
  titleEng: "",
  effectiveFrom: "",
  effectiveTo: "",
  currencyCode: "",
  fee: "",
});
const categoryOpt = ref([
  {
    label: "Maritime",
    value: "M",
  },
  {
    label: "Aviation",
    value: "A",
  },
]);
const providerOpt = ref([
  {
    label: "Maritime Services Training Insitute",
    value: "Insitute",
  },
]);
const currencyOpt = ref([
  {
    label: "HKD",
    value: "hkd",
  },
]);
const tableData = ref([]);
const columns = ref([
  {
    title: "Module Name (English)",
    value: "titleEng",
  },
  {
    title: "Module Name (Chinese)",
    value: "titleChi",
  },
  {
    title: "Course / Examination Effective From",
    value: "effectiveFrom",
  },
  {
    title: "Course / Examination Effective End",
    value: "effectiveTo",
  },
  {
    title: "Currency",
    value: "currencyCode",
  },
  {
    title: "Fee",
    value: "fee",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
  },
  {
    title: "Modified By",
    value: "modifiedBy",
  },
]);

onActivated(async () => {
  getCourseProOptList();
  getCurrencyOptList();
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
    getModuleData();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getCourseDetails(route.query.courseId);
    if (code === 200) {
      formData.value = data;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getModuleData() {
  try {
    let { code, data, message } = await getModuleList({
      courseId: route.query.courseId,
    });
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
          effectiveFrom: item.effectiveFrom
            ? timestampToTime(item.effectiveFrom, "YYYY-MM-DD hh:mm")
            : "",
          effectiveTo: item.effectiveTo
            ? timestampToTime(item.effectiveTo, "YYYY-MM-DD hh:mm")
            : "",
        };
      });
      tableData.value = result;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function handleModuleDelete(params) {
  try {
    let { code, data, message } = await deleteModule(params.moduleId);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleModuleAdd() {
  // 跳转至 module
  router.push({
    path: "/addModule",
    query: {
      courseId: route.query.courseId,
    },
  });
}

function handleModuleEdit(params) {
  // 跳转至 module
  router.push({
    path: "/editModule",
    query: {
      moduleId: params.moduleId,
    },
  });
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
async function getCourseProOptList() {
  try {
    let { code, data, message } = await getCourseProList();
    if (code === 200) {
      providerOpt.value = data.content.map((element) => {
        return {
          label: element.nameEng + "(" + element.nameChi + ")",
          value: element.providerId,
        };
      });
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
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
      const params = { ...formData.value };
      let { code, data, message } = await addCourse(params);
      if (code === 200) {
        resetForm();
        router.push({
          path: "/courseList",
          query: {},
        });
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
        courseId: route.query.courseId,
      };
      let { code, data, message } = await updateCourse(params);
      if (code === 200) {
        ElMessage.success(message);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function resetForm() {
  // formData.value = {
  //   category: "",
  //   providerId: "",
  //   courseCode: "",
  //   titleChi: "",
  //   titleEng: "",
  //   effectiveFrom: "",
  //   effectiveTo: "",
  //   currencyCode: "",
  //   fee: "",
  // };
  tableData.value = [];
}
</script>
