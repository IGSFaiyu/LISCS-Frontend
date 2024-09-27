<template>
  <div
    class="app-container"
    v-loading="isLoading"
    tiny-loading__text="Syncing, please wait a moment"
    tiny-loading__background="rgba(0,0,0,0.4)"
    tiny-loading__custom-class="tiny-demo-loading-custom"
  >
    <div class="page-title">
      <span class="title">Internal User Management</span>

      <!-- <el-button type="primary" @click="handleManualSync">
        <el-icon>
          <Refresh />
        </el-icon>
        Manual Sync
      </el-button> -->
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
        sortable
        align="center"
        :width="item.width"
      >
        <template #default="data">
          <div v-if="data.rowIndex === 0 && Object.keys(form).includes(item.value)">
            <tiny-input
              v-model="form[item.value]"
              placeholder="Search"
              @input="handleChange(item.value, form[item.value])"
            />
          </div>
          <div v-else>{{ data.row[item.value] }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="Action" align="center" width="90" fixed="right">
        <template #default="data">
          <div v-if="data.rowIndex !== 0">
            <span style="cursor: pointer" @click="handleEdit(data.row)">
              <img src="@/assets/images/edit.png" />
            </span>
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
  Loading,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { getInternalUserList, manualSync } from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } = tableComposable();

const tableData = ref([]);

const columns = ref([
  {
    title: "AD Name",
    value: "adName",
    width: "200",
  },
  {
    title: "Email Address",
    value: "emailAddress",
    width: "300",
  },
  {
    title: "Name(English)",
    value: "nameEng",
    width: "220",
  },
  {
    title: "Name(Chinese)",
    value: "nameChi",
    width: "220",
  },
  {
    title: "Division",
    value: "division",
    width: "200",
  },
  {
    title: "Role",
    value: "roleDesc",
    width: "200",
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

const form = ref({
  adName: "",
  emailAddress: "",
  nameEng: "",
  nameChi: "",
  division: "",
  roleDesc: "",
});

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const sortColumn = ref("userId");
const sortOrder = ref(0);
const allColumns = ref(
  "adName, emailAddress, nameEng, nameChi, division, roleDesc, modifiedOn, modifiedBySnap"
);

const isLoading = ref(false);
const vLoading = Loading.directive;

onActivated(async () => {
  getData();
});

async function getData() {
  try {
    let params = {
      ...form.value,
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
    };
    let { code, data, message } = await getInternalUserList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          division: item.division
            .replace("A", "Aviation")
            .replace(",", ", ")
            .replace("M", "Maritime"),
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
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
    console.log(err);
  }
}

const sortChangeEvent = async ({ field, order }) => {
  if (order != "") {
    sortColumn.value = field;
    sortOrder.value = order == "asc" ? 0 : 1;
  } else {
    sortColumn.value = "userId";
    sortOrder.value = "0";
  }
  await getData();
};

function handleChange(item, modelValue) {
  console.log(item, modelValue);
  if (Object.keys(form.value).includes(item)) {
    form.value[item] = modelValue;
  }
  getData();
}

function handleReset() {
  form.value = {
    adName: "",
    emailAddress: "",
    nameEng: "",
    nameChi: "",
    division: "",
    roleDesc: "",
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/editInternalUser",
    query: {
      userId: data.userId,
    },
  });
}

async function handleManualSync() {
  //
  isLoading.value = true;
  try {
    let { code, data, message } = await manualSync();
    if (code === 200) {
      ElMessage.success("sync success");
      isLoading.value = false;
      getData();
    } else {
      isLoading.value = false;
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
    isLoading.value = false;
  }
}

const changeCurrent = (current) => {
  pager.value.pageNum = current;
  getData();
};
const changeSize = (size) => {
  pager.value.pageSize = size;
  getData();
};
</script>
