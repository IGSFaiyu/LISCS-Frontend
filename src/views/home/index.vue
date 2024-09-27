<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Summary</span>
    </div>
    <!-- summary show -->
    <div class="summary-tab">
      <div v-for="(item, index) in summaryList" :key="index" class="summary-box">
        <div class="summary-item">
          <span style="font-size: 1.3rem">{{ item.title }}</span>
          <span>{{ item.total }}</span>
        </div>
        <div class="summary-item">
          <span>Submitted</span>
          <span>{{ item.submitted }}</span>
        </div>
        <div class="summary-item">
          <span>Processing</span>
          <span>{{ item.processing }}</span>
        </div>
        <div class="summary-item">
          <span>Follow Up Action</span>
          <span>{{ item.followUpAction }}</span>
        </div>
        <div class="summary-item">
          <span>Endorsed</span>
          <span>{{ item.endorsed }}</span>
        </div>
        <div class="summary-item">
          <span>Rejected</span>
          <span>{{ item.rejected }}</span>
        </div>
        <div class="summary-item">
          <span>Used Quota</span>
          <span>{{ item.usedQuota }}</span>
        </div>
      </div>
    </div>
    <div class="page-title">
      <span class="title">To-do List</span>
    </div>
    <tiny-grid
      ref="colGridRef"
      :data="tableData"
      @sort-change="sortChangeEvent"
      remote-sort
    >
      <tiny-grid-column
        v-for="(item, index) in columns"
        :field="item.value"
        :title="item.title"
        :key="index"
        sortable
        align="center"
        :width="item.width"
      >
        <template #default="data">
          <div v-if="data.rowIndex === 0 && Object.keys(form).includes(item.value)">
            <template v-if="form[item.value].type === 'input'">
              <tiny-input
                v-model="form[item.value].val"
                placeholder="Search"
                @input="handleChange(item.value, form[item.value].val)"
              />
            </template>
            <template v-else-if="form[item.value].type != 'date'">
              <tiny-select
                v-model="form[item.value].val"
                :options="form[item.value].options"
                placeholder="Search"
                @change="handleChange(item.value, form[item.value].val)"
              />
            </template>
          </div>
          <div v-else-if="dateCol.includes(item.value)">
            {{
              data.row[item.value]
                ? timestampToTime(new Date(data.row[item.value]), item.format)
                : ""
            }}
          </div>
          <div v-else-if="item.value == 'internalStatus'">
            {{ statusCode.filter((el) => el.value == data.row[item.value])[0].label }}
          </div>
          <div v-else-if="item.value == 'submitType'">
            {{ submitType.filter((el) => el.value == data.row[item.value])[0].label }}
          </div>
          <div v-else>{{ data.row[item.value] }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="Action" align="center" width="100" fixed="right">
        <template #default="data">
          <div v-if="data.rowIndex !== 0">
            <el-button type="primary" @click="handleEdit(data.row)">Details</el-button>
          </div>
          <div v-else>
            <el-button @click="handleReset">Reset</el-button>
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
  </div>
</template>

<script setup>
import { ref, onActivated } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
  Input as TinyInput,
  Pager as TinyPager,
  Select as TinySelect,
  Option as TinyOption,
  BaseSelect as TinyBaseSelect,
  Tabs as TinyTabs,
  TabItem as TinyTabItem,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { getsummaryList, getToDoList } from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import statusCode from "../../assets/statusCode.json";
import submitType from "../../assets/submitType.json";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } = tableComposable();

const tableData = ref([]);
const typeForm = ref({
  applicationNo: { type: "input", val: "" },
  contractorName: { type: "input", val: "" },
  internalStatus: { type: "select", val: "-1", options: [] },
  certificateNo: { type: "input", val: "" },
});
const typeColumns = ref([
  {
    title: "Application Number",
    value: "applicationNo",
    width: "200",
    type: "input",
  },
  {
    title: "Contractor Name",
    value: "contractorName",
    width: "200",
    type: "input",
  },
  {
    title: "Internal Status",
    value: "internalStatus",
    width: "200",
    type: "select",
  },
  {
    title: "Last Update Date",
    value: "modifiedOn",
    width: "200",
    type: "date",
    format: "YYYY-MM-DD hh:mm",
  },
  {
    title: "Submit Type",
    value: "submitType",
    width: "200",
    type: "select",
  },
]);

const form = computed(() => {
  const obj = {
    ...typeForm.value,
  };
  return obj;
});

const columns = computed(() => {
  return typeColumns.value;
});

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref("contractorName,internalStatus,certificateNo,modifiedOn");

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

const summaryList = ref({});

const dateCol = ref(["modifiedOn"]);

onActivated(async () => {
  await setColumnsType();
  await getWorkflowStatusData();
  await getData();
  await getSummary();
});

const getSummary = async () => {
  try {
    let { code, data, message } = await getsummaryList();
    if (code === 200) {
      summaryList.value = {
        belowOneQuarter: {
          ...data.belowOneQuarter,
          total: Object.values(data.belowOneQuarter).reduce((sum, value) => sum + value, 0),
          title: "Total(Below 1 Quarter)",
        },
        belowTwoQuarter: {
          ...data.belowTwoQuarter,
          total: Object.values(data.belowTwoQuarter).reduce((sum, value) => sum + value, 0),
          title: "Total(Below 2 Quarter)",
        },
      };
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

const getData = async () => {
  try {
    let params = {
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
    };

    for (let elem of Object.keys(form.value)) {
      console.log(elem);
      if (form.value[elem].val || form.value[elem].val == 0)
        params[elem] = form.value[elem].val;
    }

    let { code, data, message } = await getToDoList(params);
    if (code === 200) {
      const result = data.content;
      tableData.value = [{}, ...result];
      pager.value.total = data.totalElements;
      (settingId.value = data.view.settingId),
        (tableName.value = data.view.tableName),
        hideBoolCol(allColumns.value);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

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

function handleChange(item, modelValue) {
  if (Object.keys(form.value).includes(item)) {
    form.value[item].val = modelValue;
  }
  getData();
}

async function handleReset() {
  for (let elem of Object.keys(form.value)) {
    form.value[elem].val = "";
    if (["internalStatus", "submitType"].includes(elem)) form.value[elem].val = "-1";
  }
  await getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/applicantDetails",
    query: {
      applicantId: data.applicantId,
    },
  });
}

function handleAdd() {
  router.push("/addApplicant");
}

const changeCurrent = async (current) => {
  pager.value.pageNum = current;
  await getData();
};
const changeSize = async (size) => {
  pager.value.pageSize = size;
  await getData();
};

const setColumnsType = async () => {
  for (let elem of typeColumns.value) {
    if (elem.type) {
      if (elem.type != "select") {
        form.value[elem.value] = { type: elem.type, val: "" };
      } else if (elem.type == "select" && elem.value == "submitType") {
        form.value[elem.value] = {
          type: "select",
          val: "-1",
          options: [{ label: "All", value: "-1" }, ...submitType],
        };
      } else if (elem.value == "internalStatus") {
        let newType = statusCode;
        form.value[elem.value] = {
          type: "select",
          val: "-1",
          options: [{ label: "All", value: "-1" }, ...newType],
        };
      }
    }
  }
};

const getWorkflowStatusData = async () => {
  try {
    let result = statusCode;
    statusOptions.value = [{ label: "All", value: "-1" }, ...result];
    form.value.internalStatus.options = statusOptions.value;
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};
</script>

<style lang="scss" scoped>
.summary-tab {
  display: flex;
  margin-bottom: 1rem;
  .summary-box {
    border: 2px solid #848181;
    flex: 1;
    margin-right: 10px;
    border-radius: 5px;
    padding: 10px;

    .summary-item {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
