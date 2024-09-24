<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Applicant List</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon> <Plus /> </el-icon>NEW
      </el-button>
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
          @reset-setting="hideBoolCol(allColumns, true)"
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
import { ref, onActivated } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
  Input as TinyInput,
  Pager as TinyPager,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { getApplicantList } from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import statusCode from "../../assets/statusCode.json";
const route = useRoute();

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } = tableComposable();

const statusOptions = ref([]);
const tableData = ref([]);
// const form = ref({
//   applicationNo: "",
//   internalStatus: -1,
//   email: "",
//   contractorName: "",
//   certificateNo: "",
// });

const typeForm = ref({
  applicationNo: { type: "input", val: "" },
  internalStatus: { type: "select", val: -1, options: [] },
  contractorName: { type: "input", val: "" },
  email: { type: "input", val: "" },
  certificateNo: { type: "input", val: "" },
});

const form = computed(() => {
  const obj = {
    ...typeForm.value,
  };
  return obj;
});
const typeColumns = ref([
  {
    title: "Application Number",
    value: "applicationNo",
    width: "250",
  },
  {
    title: "Internal Status",
    value: "internalStatus",
    width: "250",
  },
  {
    title: "Email",
    value: "email",
    width: "250",
  },
  {
    title: "Contractor Name",
    value: "contractorName",
    width: "250",
  },
  {
    title: "Certificate Number",
    value: "certificateNo",
    width: "250",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
    width: "180",
  },
  {
    title: "Modified By",
    value: "modifiedBySnap",
    width: "180",
  },
]);

const columns = computed(() => {
  return typeColumns.value;
});

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref(
  "applicationNo,internalStatus,email,contractorName,certificateNo,modifiedOn, modifiedBySnap"
);

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

onActivated(async () => {
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
      applicationNo: form.value.applicationNo.val,
      internalStatus: form.value.internalStatus.val,
      email: form.value.email.val,
      contractorName: form.value.contractorName.val,
      certificateNo: form.value.certificateNo.val,
    };
    let { code, data, message } = await getApplicantList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
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
    form.value[item] = modelValue;
  }
  getData();
}

function handleReset() {
  form.value = {
    email: "",
    nameChi: "",
    nameEng: "",
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/applicantDetails",
    query: {
      applicantId: data.applicationId,
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
</script>
