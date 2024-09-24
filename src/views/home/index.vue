<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Summary</span>
    </div>
    <!-- summary show -->
    <div class="summary-tab">
      <div v-for="(item, index) in summaryList" :key="index" class="summary-box">
        <div class="summary-item">
          <span style="font-size: 1.3rem;">{{ item.title }}</span>
          <span>{{ item.total }}</span>
        </div>
        <div class="summary-item">
          <span>Submitted</span>
          <span>{{ item.submitted }}</span>
        </div>
        <div class="summary-item">
          <span>Pre-vetting</span>
          <span>{{ item.preVetting }}</span>
        </div>
        <div class="summary-item">
          <span>Vetting</span>
          <span>{{ item.vetting }}</span>
        </div>
        <div class="summary-item">
          <span>Querying</span>
          <span>{{ item.querying }}</span>
        </div>
        <div class="summary-item">
          <span>Pending Approval</span>
          <span>{{ item.pendingApproval }}</span>
        </div>
        <div class="summary-item">
          <span>Pending Rejection</span>
          <span>{{ item.pendingRejection }}</span>
        </div>
        <div class="summary-item">
          <span>Pending Payment</span>
          <span>{{ item.pendingPayment }}</span>
        </div>
      </div>
    </div>
    <div class="page-title">
      <span class="title">To-do List</span>
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
      <tiny-grid-column
        v-for="(item, index) in columns"
        :field="item.value"
        :title="item.title"
        :key="index"
        sortable
        align="center"
        :width="item.width"
      />
      <tiny-grid-column title="Action" align="center" width="100" fixed="right">
        <template #default="data">
          <el-button type="primary" @click="handleEdit(data.row)">Details</el-button>
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
import { getsummaryList } from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const tableData = ref([]);
const columns = ref([
  {
    title: "Application Number",
    value: "number",
    width: "280",
  },
  {
    title: "Last Update Date",
    value: "update date",
    width: "300",
  },
  {
    title: "Applicant",
    value: "applicant",
    width: "200",
  },
  {
    title: "Internal Status",
    value: "status",
    width: "250",
  },
  {
    title: "MATF Course / Examination Code",
    value: "Code",
    width: "300",
  },
  {
    title: "Name of Course Provider / Examination Authority",
    value: "name",
    width: "350",
  },
  {
    title: "Course / Examination Title",
    value: "title",
    width: "250",
  },
  {
    title: "Claim Amount (HKD)",
    value: "amount",
    width: "300",
  },
]);

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref(
  "email, title, nameChi, nameEng, gender, modifiedOn, modifiedBySnap"
);

const sortColumn = ref("applicantId");
const sortOrder = ref(0);

const summaryList = ref({})

onActivated(async () => {
  // await getData();
  await getSummary();
});

const getSummary = async () => {
  try {
    let { code, data, message } = await getsummaryList();
    if (code === 200) {
      summaryList.value = {
        belowOneMonth: {
          ...data.belowOneMonth,
          total: Object.values(data.belowOneMonth).reduce((sum, value) => sum + value, 0),
          title: 'Total(Below 1 Month)'
        },
        oneToSixMonth: {
          ...data.oneToSixMonth,
          total: Object.values(data.oneToSixMonth).reduce((sum, value) => sum + value, 0),
          title: 'Total(1 to 6 Months)'
        },
        overSixMonth: {
          ...data.overSixMonth,
          total: Object.values(data.overSixMonth).reduce((sum, value) => sum + value, 0),
          title: 'Total(Over 6 Months)'
        },
      }
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
      email: form.value.email,
      nameChi: form.value.nameChi,
      nameEng: form.value.nameEng,
    };
    let { code, data, message } = await getApplicantList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
          nameChi: item.surnameChi + item.givenNameChi,
          nameEng:
            item.surnameEng + (item.surnameEng ? "," : "") + item.givenNameEng,
        };
      });
      tableData.value = [{}, ...result];
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

