<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Reason For Rejection</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus />
        </el-icon>NEW
      </el-button>
    </div>
    <tiny-grid ref="colGridRef" :data="tableData" @sort-change="sortChangeEvent" remote-sort>
      <template #toolbar>
        <tiny-grid-toolbar
          id="custom-width"
          :resizable="{ storage: true }"
          @save-setting="saveSetting"
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
      >
        <template #default="data">
          <div v-if="data.row._$index_ === '1' && (Object.keys(form).includes(item.value))">
            <tiny-input
              v-model="form[item.value]"
              placeholder="Search"
              @input="handleChange(item.value, form[item.value])"
            />
          </div>
          <div v-else>{{ data.row[item.value] }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="Action" align="center" width="100" fixed="right">
        <template #default="data">
          <div v-if="data.row._$index_ !== '1'">
            <span style="cursor: pointer" @click="handleEdit(data.row)">
              <img src="@/assets/images/edit.png" />
            </span>
            <span>
              <confirm-delete :data="data" @delete-method="handleDelete(data.row)" />
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
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { getReasonList, deleteReason } from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const tableData = ref([]);

const form = ref({
  internalDesc: "",
});
const columns = ref([
  {
    title: "Label (English)",
    value: "internalDesc",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
  },
  {
    title: "Modified By",
    value: "modifiedBySnap",
  },
]);
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref("descEng, mappedField, modifiedOn, modifiedBySnap");
const sortColumn = ref("reasonId");
const sortOrder = ref(0);

onActivated(async () => {
  getData();
});

async function getData() {
  try {
    let params = {
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
    };
    let { code, data, message } = await getReasonList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          createdOn: item.createdOn
            ? timestampToTime(item.createdOn, "YYYY-MM-DD hh:mm")
            : "",
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
        };
      });
      tableData.value = [{}, ...result];
      pager.value.total = data.numberOfElements;
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
    sortColumn.value = "reasonId";
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
    escChi: "",
    descEng: "",
    mappedField: "",
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/editReason",
    query: {
      reasonId: data.reasonId,
      internalDesc: data.internalDesc
    },
  });
}

function handleAdd() {
  // 跳转至详情页
  router.push("/addReason");
}

async function handleDelete(row) {
  try {
    let { code, data, message } = await deleteReason(row.reasonId);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
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
