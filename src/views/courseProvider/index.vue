<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Course Provider</span>
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
          <div v-if="data.row._$index_ === '1'">
            <tiny-input v-model="form[item.value]" placeholder="Search" @input="handleChange(item.value, form[item.value])" />
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
import { getCourseProList, deleteCoursePro } from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const tableData = ref([]);

const form = ref({
  nameEng: "",
  nameChi: "",
});
const columns = ref([
  {
    title: "Name (English)",
    value: "nameEng",
    width: "550",
  },
  {
    title: "Name (Chinese)",
    value: "nameChi",
    width: "550",
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

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const allColumns = ref("nameEng, nameChi, modifiedOn, modifiedBySnap")

const sortColumn = ref("providerId");
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
      nameEng: form.value.nameEng,
      nameChi: form.value.nameChi,
    };
    let { code, data, message } = await getCourseProList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
        };
      });
      tableData.value = [{}, ...result];
      pager.value.total = data.totalElements;
      settingId.value = data.view.settingId,
      tableName.value = data.view.tableName,
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
    sortColumn.value = "providerId";
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
    nameEng: "",
    nameChi: "",
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/editCourseProvider",
    query: {
      providerId: data.providerId,
    },
  });
}

function handleAdd() {
  // 跳转至详情页
  router.push("/addCourseProvider");
}

async function handleDelete(params) {
  try {
    let { code, data, message } = await deleteCoursePro(params.providerId);
    if (code === 200) {
      ElMessage.success(message);
      getData();
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
