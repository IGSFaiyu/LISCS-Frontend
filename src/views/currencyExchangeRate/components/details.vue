<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Currency - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Currency Code" prop="currencyCode" required>
            <tiny-input
              v-model="formData.currencyCode"
              :maxlength="5"
              show-word-limit
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Rate" prop="rate" required>
            <tiny-input v-model="formData.rate" type="number" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Name (Chinese)" prop="descChi" required>
            <tiny-input v-model="formData.descChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Name (English)" prop="descEng" required>
            <tiny-input v-model="formData.descEng" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
    <div v-if="title === 'Update'">
      <div class="page-title">
        <span class="title">Currency History</span>
      </div>
      <tiny-grid :data="historyTableData">
        <tiny-grid-column
          v-for="(item, index) in columns"
          :field="item.value"
          :title="item.title"
          :key="index"
        />
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
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from "@opentiny/vue";
import router from "@/router";
import {
  addCurrency,
  updateCurrency,
  getCurrencyDetails,
  getHistoryList,
  getHistoryCode,
} from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
let formData = ref({
  currencyCode: "",
  descChi: "",
  descEng: "",
  rate: 0,
});
const columns = ref([
  {
    title: "Currency",
    value: "currencyCode",
  },
  {
    title: "Exchange Rate (to HKD)",
    value: "rate",
  },
  {
    title: "Effective Date",
    value: "effectiveDate",
  },
]);
const historyTableData = ref([]);

onActivated(async () => {
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
    getHistoryCodes();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getCurrencyDetails(
      route.query.currencyCode
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

async function getHistoryCodes() {
  try {
    let { code, data, message } = await getHistoryCode(
      route.query.currencyCode
    );
    if (code === 200) {
      historyTableData.value = data.content;
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
      };
      let { code, data, message } = await addCurrency(params);
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
        currencyCode: route.query.currencyCode,
      };
      let { code, data, message } = await updateCurrency(params);
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
