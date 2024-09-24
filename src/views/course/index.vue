<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Course</span>
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
import { getCourseList, deleteCourse } from "@/api/index";
import { ElMessage } from "element-plus";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const tableData = ref([]);

const form = ref({
  category: "",
  courseCode: "",
  titleChi: "",
  titleEng: "",
  currencyCode: "",
});
const columns = ref([
  {
    title: "Course Provider",
    value: "providerNameEng",
    width: "550",
  },
  {
    title: "Category",
    value: "category",
    width: "150",
  },
  {
    title: "MATF Course / Examination Code",
    value: "courseCode",
    width: "250",
  },
  {
    title: "Course / Examination Title (Chinese)",
    value: "titleChi",
    width: "550",
  },
  {
    title: "Course / Examination Title (English)",
    value: "titleEng",
    width: "550",
  },
  {
    title: "Course / Examination Effective From",
    value: "effectiveFrom",
    width: "250",
  },
  {
    title: "Course / Examination Effective End",
    value: "effectiveTo",
    width: "250",
  },
  {
    title: "Currency",
    value: "currencyCode",
    width: "150",
  },
  {
    title: "Fee",
    value: "fee",
    width: "120",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
    width: "250",
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
const sortColumn = ref("courseId");
const sortOrder = ref(0);
const allColumns = ref("providerNameEng, category, courseCode, titleChi, titleEng, effectiveFrom, effectiveTo, currencyCode, fee, modifiedOn, modifiedBySnap")

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
      category: form.value.category,
      courseCode: form.value.courseCode,
      titleChi: form.value.titleChi,
      titleEng: form.value.titleEng,
      currencyCode: form.value.currencyCode,
    };
    let { code, data, message } = await getCourseList(params);
    if (code === 200) {
      const result = data.content.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
          effectiveFrom: item.effectiveFrom
            ? timestampToTime(item.effectiveFrom, "YYYY-MM-DD hh:mm")
            : "",
          effectiveTo: item.effectiveTo
            ? timestampToTime(item.effectiveTo, "YYYY-MM-DD hh:mm")
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
    sortColumn.value = "courseId";
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
    category: "",
    courseCode: "",
    titleChi: "",
    titleEng: "",
    currencyCode: "",
  };
  getData();
}

function handleEdit(data) {
  // 跳转至详情页
  router.push({
    path: "/editCourse",
    query: {
      courseId: data.courseId,
    },
  });
}

function handleAdd() {
  // 跳转至详情页
  router.push("/addCourse");
}

async function handleDelete(params) {
  try {
    let { code, data, message } = await deleteCourse(params.courseId);
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
