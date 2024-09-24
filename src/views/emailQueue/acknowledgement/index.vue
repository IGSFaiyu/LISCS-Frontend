<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Pending Mail List - {{ route.name }}</span>
    </div>
    <div style="display: flex;justify-content: space-between;align-items: flex-end;">
      <div class="search-item">
        <span>From</span>
        <tiny-select v-model="searchBarForm.type">
          <tiny-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></tiny-option>
        </tiny-select>
      </div>
      <div class="search-item">
        <span>Status</span>
        <tiny-select v-model="searchBarForm.status">
          <tiny-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></tiny-option>
        </tiny-select>
      </div>
      <el-button type="primary" @click="handleSearch">Search</el-button>
    </div>
    <div v-if="searchBarForm.status === 'in queue'" style="width: 100%;height: 32px;margin-top: 3rem;">
      <el-button type="primary" @click="handleSend" style="float: right;">Batch Send</el-button>
    </div>
    <div v-if="route.name === 'Query'" style="margin-top: 1rem;">
      <div class="search-item">
        <span>Query Status</span>
        <tiny-select v-model="searchBarForm.queryStatus">
          <tiny-option
            v-for="item in queryStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></tiny-option>
        </tiny-select>
      </div>
    </div>
    <tiny-grid ref="colGridRef" :data="tableData" @sort-change="sortChangeEvent" remote-sort>
      <template #toolbar>
        <tiny-grid-toolbar
          id="custom-width"
          :resizable="{ storage: true }"
          @save-setting="saveSetting"
          @reset-setting="hideBoolCol(allColumns, true)"
          :setting="{
            storage: 'local'
          }"
        />
      </template>
      <tiny-grid-column type="selection" width="60" />
      <tiny-grid-column
        v-for="(item, index) in columns"
        :field="item.value"
        :title="item.title"
        :key="index"
        sortable
        align="center"
        :width="item.width"
      ></tiny-grid-column>
      <tiny-grid-column title="Action" align="center" width="100" fixed="right">
        <template #default="data">
          <el-button
            type="primary"
            @click="handlePrepare(data.row)"
          >{{ searchBarForm.status === 'not prepare' ? 'Prepare' : 'Review'}}</el-button>
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
    <!-- prepare提示彈框 -->
    <PrepareDialog
      ref="prepareDialog"
      :applicant-name="applicantName"
      :applicant-id="applicantId"
      :application-numbers="applicationNumbers"
      :letter-title="route.name"
      :category="searchBarForm.type"
    />
  </div>
</template>

<script setup>
import { ref, onActivated, computed } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
  Input as TinyInput,
  Pager as TinyPager,
  Select as TinySelect,
  Option as TinyOption,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import {
  getAcknowledgementList,
  getApprovalList,
  getQueryList,
  getStopProcessingList,
  getRejectionList,
  sendMail,
} from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import { useRoute } from "vue-router";
import PrepareDialog from "@/views/emailQueue/acknowledgement/components/prepareDialog.vue";
const route = useRoute();

const colGridRef = ref();
const tableData = ref([]);
const searchForm = ref({
  applicantName: "",
  email: "",
  numbers: "",
});
const prepareDialog = ref();
const columns = ref([
  {
    title: "Applicant Name",
    value: "applicant_name",
  },
  {
    title: "Email",
    value: "email_address",
  },
  {
    title: "Application Numbers",
    value: "application_numbers",
  },
]);

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref("applicantName,email,numbers");
const statusOptions = ref([
  {
    label: "Not Prepare",
    value: "not prepare",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
  {
    label: "In Queue",
    value: "in queue",
  },
  {
    label: "Sent",
    value: "sent",
  },
]);
const typeOptions = ref([
  {
    label: "Maritime",
    value: "M",
  },
  {
    label: "Aviation",
    value: "A",
  },
]);
const queryStatusOptions = ref([
  {
    label: "First Query",
    value: "6",
  },
  {
    label: "1st Query Reminder",
    value: "25",
  },
  {
    label: "2nd Query Reminder",
    value: "27",
  },
]);
const searchBarForm = ref({
  type: "M",
  status: "not prepare",
  queryStatus: "6",
});
const applicantName = ref("");
const applicationNumbers = ref("");
const applicantId = ref("");

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

onActivated(async () => {
  getDataApi();
});

watch(
  searchBarForm,
  (val) => {
    if (val.type || val.status || val.queryStatus) {
    }
  },
  { deep: true, immediate: true }
);

const getDataApi = async () => {
  switch (route.name) {
    case "Acknowledgement":
      return getData(getAcknowledgementList);
    case "Query":
      return getData(getQueryList);
    case "StopProcessing":
      return getData(getStopProcessingList);
    case "Approval":
      return getData(getApprovalList);
    default:
      return getData(getRejectionList);
  }
};

const getData = async (api) => {
  try {
    const params = {
      status: searchBarForm.value.status,
      category: searchBarForm.value.type,
    };
    if (route.name === "Query") {
      params.workflowState = searchBarForm.value.queryStatus;
    }
    let { code, data, message } = await api(params);
    if (code === 200) {
      tableData.value = data;
      pager.value.total = data.length;
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
  await getDataApi();
};

function handleChange(item, modelValue) {
  if (Object.keys(form.value).includes(item)) {
    form.value[item] = modelValue;
  }
  getDataApi();
}

function handleReset() {
  form.value = {
    email: "",
    nameChi: "",
    nameEng: "",
  };
  getDataApi();
}

function handlePrepare(data) {
  if (searchBarForm.status === "not prepare") {
    applicantName.value = data.applicant_name;
    applicationNumbers.value = data.application_numbers;
    applicantId.value = data.applicant_id;
    prepareDialog.value.openDialog();
  } else {
    router.push({
      path: "/reviewLetter",
      query: {
        mailId: data.mail_id,
        templateType: route.name,
      },
    });
  }
}

function handleSearch() {
  getDataApi();
}

async function handleSend() {
  const params = {};
  let idArr = [];
  colGridRef.value.getSelectRecords().forEach((item) => {
    idArr.push(item.mail_id);
  });
  params.mailId = idArr.toString();
  if (!params.mailId) {
    ElMessage.warning("Please select at least one piece of data.");
    return;
  }
  try {
    let { code, data, message } = await sendMail(params);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
}

const changeCurrent = async (current) => {
  pager.value.pageNum = current;
  await getDataApi();
};
const changeSize = async (size) => {
  pager.value.pageSize = size;
  await getDataApi();
};
</script>

<style lang="scss" scoped>
.search-item {
  width: 30%;
  span {
    display: inline-block;
    color: #6f7482;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
