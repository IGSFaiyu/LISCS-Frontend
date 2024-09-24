<template>
  <div
    class="app-container"
    v-loading="isLoading"
    tiny-loading__text="Syncing, please wait a moment"
    tiny-loading__background="rgba(0,0,0,0.4)"
    tiny-loading__custom-class="tiny-demo-loading-custom"
  >
    <div class="page-title">
      <span class="title">Letter Template Management</span>
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
            <template v-if="form[item.value].type==='input'"> 
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
      <tiny-grid-column title="Action" align="center" width="90" fixed="right">
        <template #default="data">
          <div v-if="data.row._$index_ !== '1'">
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
  Select as TinySelect,
  Pager as TinyPager,
  Loading,
} from "@opentiny/vue";
import router from "@/router";
import { getLetterTemplateList } from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import { formatResponse } from "@/utils/common.js";


const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const tableData = ref([]);

const columns = ref([
  {
    title: "Template Name",
    value: "name",
    width: "600",
  },
  {
    title: "Language",
    value: "language",
    width: "500",
  },
  {
    title: "Category",
    value: "category",
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

const categoryOption = [{ label: "All", value: "" }, { label: "Aviation", value: "A" }, { label: "Martime", value: "M" }];
const languageOption = [{ label: "All", value: "" }, { label: "English", value: "en" }, { label: "繁體中文", value: "zh-TW" }];
const form = ref({
  name: {
    type: 'input',
    val: ""
  },
  language: {
    type: 'select',
    val: "",
    options: languageOption
  },
  category: {
    type: 'select',
    val: "",
    options: categoryOption
  },
});

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

const sortColumn = ref("templateId");
const sortOrder = ref(0);
const allColumns = ref("name, isEmail, language, modifiedOn, modifiedBySnap");

const isLoading = ref(false);
const vLoading = Loading.directive;

onActivated(async () => {
  getData();
});

async function getData() {
  try {
    let params = {
      name:form.value.name.val,
      language:form.value.language.val,
      category:form.value.category.val,
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
    };
    let { code, data, message } = await getLetterTemplateList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
          language: formatResponse(languageOption, item.language),
          category: formatResponse(categoryOption, item.category)
        }
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
    sortColumn.value = "userId";
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

function handleReset() {
  form.value = {
    name: {
    type: 'input',
    val: ""
  },
  language: {
    type: 'select',
    val: "",
    options: languageOption
  },
  category: {
    type: 'select',
    val: "",
    options: categoryOption
  },
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/editLetterTemplate",
    query: {
      templateId: data.templateId,
    },
  });
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
