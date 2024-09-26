<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Account Management</span>
    </div>
    <div>
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
            <div>{{ data.row[item.value] }}</div>
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

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const typeColumns = ref([
  {
    title: "Account Name",
    value: "username",
    width: "200",
  },
  {
    title: "Email",
    value: "email",
    width: "200",
  },
  {
    title: "Phone Number",
    value: "phoneNumber",
    width: "200",
  },
]);
const columns = computed(() => {
  return typeColumns.value;
});
const typeForm = ref({});
const form = computed(() => {
  const obj = {
    ...typeForm.value,
  };
  return obj;
});
const sortColumn = ref("applicantId");
const sortOrder = ref(0);

const getData = async () => {}

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

async function handleReset() {
  for (let elem of Object.keys(form.value)) {
    form.value[elem].val = "";
    if (["internalStatus", "submitType"].includes(elem)) form.value[elem].val = "-1";
  }
  await getData();
}
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
