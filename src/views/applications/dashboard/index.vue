<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Applications - {{ pageTitle }}</span>
    </div>
    <tiny-tabs :active-name="activeName" tab-style="card" @click="changeTabs">
      <tiny-tab-item
        v-for="item in dashboardStatusOp"
        :key="item.name"
        :title="item.title"
        :name="item.name"
      />
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px">
        Display Columns:
        <div>
          <tiny-base-select
            multiple
            filterable
            v-model="displayColumns"
            @change="changeColumns"
          >
            <tiny-option
              v-for="item in dashboardColumns"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            >
            </tiny-option>
          </tiny-base-select>
        </div>
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
    </tiny-tabs>
  </div>
</template>

<script setup>
import { ref, onActivated, computed, onMounted, nextTick } from "vue";
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
import { getDashboard, getWorkflowStatusList } from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import { useRoute } from "vue-router";
import statusCode from "../../../assets/statusCode.json";
import dashboardColumns from "../../../assets/dashboardColumns.json";
import submitType from "../../../assets/submitType.json";
import * as common from "../../../comon";
import { filter } from "lodash-es";
const route = useRoute();

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } = tableComposable();

const props = defineProps({
  activeName: String,
});

const activeName = ref("All");
// const dashboardStatusOp = ref([
//   { name: `All`, title: "All" },
//   { name: `Draft`, title: "Draft" },
//   { name: `Pending Approval`, title: "Pending Approval" },
//   { name: `Approved`, title: "Approved" },
// ]);
const dashboardStatusOp = ref([
  { name: `All`, title: "All" },
  ...statusCode.map((item) => {
    return { name: item.label, title: item.label };
  }),
]);
const activeOp = ref({
  Draft: [0],
  "Pending Approval": [1, 2, 3, 4, 5, 6, 7, 8],
  Approved: [9],
});

const pageTitle = ref("");
const tableData = ref([]);
const displayColumns = ref([
  "applicationNo",
  "contractorName",
  "internalStatus",
  "modifiedOn",
]);
const typeColumns = ref(
  dashboardColumns.filter((el) => displayColumns.value.includes(el.value))
);
const typeForm = ref({
  internalStatus: { type: "select", val: "-1", options: [] },
});
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref("applicationNo,contractorName,internalStatus,modifiedOn");
const statusOptions = ref([]);
const targetInternalStatus = ref("-1");

const dateCol = ref(
  dashboardColumns
    .filter((el) => el.type == "date")
    .map((item) => {
      return item.value;
    })
);

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

const form = computed(() => {
  const obj = {
    ...typeForm.value,
  };
  return obj;
});

const columns = computed(() => {
  return typeColumns.value;
});

onMounted(async () => {
  await initLoad();
});

onActivated(async () => {
  await initLoad();
});

const initLoad = async () => {
  activeName.value = route?.query?.activeName ? route?.query?.activeName : "All";

  pageTitle.value = "Dashboard";
  await setColumnsType();
  await getWorkflowStatusData();
  await getData();
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

const getData = async () => {
  try {
    let params = {
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
    };
    if (activeName.value != "All") {
      // params["specStatus"] = activeOp.value[activeName.value];
      params["specStatus"] = statusCode.filter(el=> el.label ==  activeName.value)[0].value;
    }

    for (let elem of Object.keys(form.value)) {
      console.log(elem);
      if (form.value[elem].val || form.value[elem].val == 0)
        params[elem] = form.value[elem].val;
    }

    let getListFunction = getDashboard;

    let { code, data, message } = await getListFunction(params);
    if (code === 200) {
      const result = data.content;
      tableData.value = [{}, ...result];
      pager.value.total = data.totalElements;
      (settingId.value = 12),
        (tableName.value = "dashboard"),
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
  // 跳转至详情页 todo
  console.log("handle edit ---", data);
  router.push({
    path: "/editApplications",
    state: {
      applicationId: data.applicationId,
    },
  });
}

function handleAdd() {
  router.push("/addApplicant");
}

function changeStatus(val) {
  targetInternalStatus.value = val;
  getData(val);
}

const changeCurrent = async (current) => {
  pager.value.pageNum = current;
  await getData();
};
const changeSize = async (size) => {
  pager.value.pageSize = size;
  await getData();
};

const changeColumns = async (a) => {
  typeColumns.value = dashboardColumns.filter((el) =>
    displayColumns.value.includes(el.value)
  );
  // let newTypeForm = {};
  await setColumnsType();
  await getData();
};

const changeTabs = async (tab) => {
  activeName.value = tab.title;
  await setColumnsType();
  await handleReset();
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
      } else if (activeName.value != "All" && elem.value == "internalStatus") {
        // let newType = statusCode.filter((el) =>
        //   activeOp.value[activeName.value].includes(el.value)
        // );
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
</script>

<style lang="scss" scoped>
.search-bar {
  width: 30%;
  span {
    display: inline-block;
    color: #6f7482;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
