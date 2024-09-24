<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Applications - {{ pageTitle }}</span>
    </div>
    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px">
      Display Columns:
      <div>
        <label
          v-for="(item, index) in dashboardColumns.filter((el) =>
            displayColumns.includes(el.value)
          )"
        >
          {{ (index != 0 ? ", " : "") + item.title }}
        </label>
      </div>
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
            <template v-else>
              <tiny-select
                v-model="form[item.value].val"
                :options="form[item.value].options"
                placeholder="Search"
                @change="handleChange(item.value, form[item.value].val)"
              />
            </template>
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
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import {
  getApplicationList,
  getMaritimeList,
  getAviationList,
  getWorkflowStatusList,
} from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import { useRoute } from "vue-router";
import statusCode from "../../../assets/statusCode.json";
import dashboardColumns from "../../../assets/dashboardColumns.json";
const route = useRoute();

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } = tableComposable();

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
  contractorName: { type: "input", val: "" },
  email: { type: "input", val: "" },
  certificateNo: { type: "input", val: "" },
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

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

const form = computed(() => {
  if (route.name === "Drafts") {
    return typeForm.value;
  } else {
    const obj = {
      ...typeForm.value,
      applicationNumber: { type: "input", val: "" },
    };
    return obj;
  }
});

const columns = computed(() => {
  return typeColumns.value;
});

onMounted(async () => {
  pageTitle.value = "Dashboard";
  await getWorkflowStatusData();
  await getData();
});

onActivated(async () => {
  pageTitle.value = "Dashboard";
  await getWorkflowStatusData();
  await getData();
});

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
      contractorName: form.value.contractorName.val,
      email: form.value.email.val,
      certificateNo: form.value.certificateNo.val,
      internalStatus: form.value.internalStatus.val ? form.value.internalStatus.val : 0,
    };
    if (pageTitle.value !== "Drafts") {
      params.applicationNumber = form.value.applicationNumber.val;
    }
    let getListFunction =
      pageTitle.value === "Drafts"
        ? getApplicationList
        : pageTitle.value === "Form 1"
        ? getMaritimeList
        : getAviationList;

    let { code, data, message } = await getListFunction(params);

    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
          applicant: item.surnameEng + (item.surnameEng ? "," : "") + item.givenNameEng,
          internalStatus:
            statusOptions.value.find(
              (optionItem) => optionItem.value == item.internalStatus
            )?.label ?? "Draft",
        };
      });
      tableData.value = [{}, ...result];
      pager.value.total = data.totalElements;
      (settingId.value = data.view.settingId),
        (tableName.value = data.view.tableName),
        hideBoolCol(
          data.view.tableSetting === "*" ? allColumns.value : data.view.tableSetting
        );
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
  form.value.contractorName.val = "";
  form.value.email.val = "";
  form.value.certificateNo.val = "";
  form.value.internalStatus.val = "";

  if (pageTitle.value !== "Drafts") {
    form.value.applicationNumber = { type: "input", val: "" };
  }
  await getData();
}

function handleEdit(data) {
  // 跳转至详情页 todo
  console.log("handle edit ---", data);
  router.push({
    path: "/newApplications",
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
  // await getData();
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
