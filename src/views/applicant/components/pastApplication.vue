<template>
  <div class="list-page">
    <div class="show-bar">
      <div v-for="(item, index) in showList" :key="index" class="show-item">
        <span>{{ item.title }}</span>
        <span>{{ item.count }}</span>
      </div>
    </div>
    <div style="text-align: right">
      <el-button type="danger" @click="handleAdd"
        >Create New Application</el-button
      >
    </div>
    <div class="search-bar">
      <el-form
        ref="formRef"
        :model="searchForm"
        label-position="top"
        style="display: flex; align-items: center; position: relative"
      >
        <el-form-item label="Year of Search" prop="year">
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            value-format="YYYY"
            placeholder=" "
            style="margin-right: 10px"
          />
        </el-form-item>
        <el-form-item label="Month of Search" prop="month">
          <el-select
            v-model="searchForm.month"
            style="margin-right: 10px"
            placeholder=" "
          >
            <el-option
              v-for="item in monthOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Form Type" prop="type">
          <el-select
            v-model="searchForm.type"
            style="margin-right: 10px; width: 120px"
          >
            <el-option label="Maritime" value="M" />
            <el-option label="Aviation" value="A" />
            <el-option label="All" value=" " />
          </el-select>
        </el-form-item>
        <div style="margin-top: 30px">
          <el-button @click="hadleReset">Reset</el-button>
        </div>
      </el-form>
    </div>
    <tiny-grid
      ref="colGridRef"
      :data="tableData"
      @sort-change="sortChangeEvent"
      remote-sort
    >
      <template #toolbar>
        <tiny-grid-toolbar
          id="custom-width"
          :resizable="{ storage: true }"
          @save-setting="saveSetting"
          :setting="{
            storage: 'local',
          }"
        />
      </template>
      <tiny-grid-column
        v-for="(item, index) in columns"
        :field="item.value"
        :title="item.title"
        :key="index"
        align="center"
        sortable
      />
      <tiny-grid-column title="Action" width="100">
        <template #default="data">
          <div class="action-column">
            <el-button type="primary" @click="handleEdit(data.row)"
              >Details</el-button
            >
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager
      align="right"
      :current-page="pager.pageNum"
      :page-size="pager.pageSize"
      :total="pager.total"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, prev, pager, next, jumper, sizes"
      @current-change="changeCurrent"
      @size-change="changeSize"
    />
    <div
      style="
        display: flex;
        text-align: center;
        margin-top: 50px;
        justify-content: right;
      "
    >
      <el-button @click="goBack">Back</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
  Pager as TinyPager,
} from "@opentiny/vue";
import router from "@/router";
import { getBalance, getPastApplication } from "@/api/index";
import { formattedAmount } from "@/utils/common.js";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const props = defineProps({
  applicantId: {
    type: String,
  },
});

const formRef = ref();
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const balanceCount = ref(0);
const inProgressCount = ref(0);
const projectionCount = ref(0);
const showList = ref([
  {
    title: "Balance",
    count: balanceCount,
  },
  {
    title: "In Progress (Maritime + Aviation)",
    count: inProgressCount,
  },
  {
    title: "Projection",
    count: projectionCount,
  },
]);
const tableData = ref([]);
const columns = ref([
  {
    title: "Application Number",
    value: "applicationNumber",
  },
  {
    title: "Last Update  Date",
    value: "lastUpdateDate",
  },
  {
    title: "Internal Status",
    value: "internalStatus",
  },
  {
    title: "MATF Course / Examination Code",
    value: "courseCode",
  },
  {
    title: "Name of Course Provider / Examination Authority",
    value: "courseProvider",
  },
  {
    title: "Course / Examination Title",
    value: "courseTitleEng",
  },
  {
    title: "Claim Amount (HKD)",
    value: "approvedAmount",
  },
]);
const allColumns = ref(
  "applicationNumber,approvedAmount,courseCode,courseProvider,lastUpdateDate,courseTitleEng,internalStatus"
);
const searchForm = ref({
  year: "",
  month: "",
  type: " ",
});
const monthOptions = ref([]);
const sortColumn = ref("applicationId");
const sortOrder = ref(0);

watch(
  searchForm,
  (val) => {
    if (val) {
      getData();
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  getData();
  getBalanceCount();
  generateMonth();
});

async function getData() {
  try {
    const params = {
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
      applicantId: props.applicantId,
      year: searchForm.value.year,
      month: searchForm.value.month,
      type: searchForm.value.type,
    };
    let { code, data, message } = await getPastApplication(params);
    if (code === 200) {
      tableData.value = data.content.map((item) => {
        return {
          ...item,
          lastUpdateDate: item.lastUpdateDate
            ? timestampToTime(item.lastUpdateDate, "YYYY-MM-DD hh:mm")
            : "",
        };
      });
      pager.value.total = data.totalElements;
      (settingId.value = data.view.settingId),
        (tableName.value = data.view.tableName),
        hideBoolCol(
          data.view.tableSetting === "*"
            ? allColumns.value
            : data.view.tableSetting
        );
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
}

async function getBalanceCount() {
  try {
    let { code, data, message } = await getBalance(props.applicantId);
    if (code === 200) {
      balanceCount.value = formattedAmount(data.balance);
      inProgressCount.value = formattedAmount(data.inProgress);
      projectionCount.value = formattedAmount(data.projection);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
}

const sortChangeEvent = async ({ field, order }) => {
  if (order != "") {
    sortColumn.value = field;
    sortOrder.value = order == "asc" ? 0 : 1;
  } else {
    sortColumn.value = "applicantId";
    sortOrder.value = "0";
  }
  await getData();
};

function generateMonth() {
  for (let i = 1; i <= 12; i++) {
    monthOptions.value.push(String(i).padStart(2, "0"));
  }
}

function hadleReset() {
  formRef.value.resetFields();
}

const changeCurrent = async (current) => {
  pager.value.pageNum = current;
  await getData();
};
const changeSize = async (size) => {
  pager.value.pageSize = size;
  await getData();
};

function handleEdit() {
  // 跳转至详情页
}

function goBack() {
  router.go(-1);
}

const handleAdd = () => {
  router.push({
    path: "/newApplications",
    state: {
      applicantId: props.applicantId,
    },
  });
};
</script>

<style lang="scss">
.list-page {
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .show-bar {
    display: flex;
    margin-top: 15px;
    .show-item {
      margin-right: 10px;
      width: 230px;
      padding: 15px 0px 40px 15px;
      background-color: #f8f8f8;
      display: flex;
      flex-direction: column;
      span:nth-child(1) {
        font-size: 14px;
        color: #8b919c;
        margin-bottom: 10px;
      }
      span:nth-child(2) {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
}
.el-icon {
  margin-right: 10px;
}
</style>
