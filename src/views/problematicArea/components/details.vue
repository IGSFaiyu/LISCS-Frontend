<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Problematic Area - {{ pageTitle }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Label (Chinese)" prop="descChi" required>
            <tiny-input v-model="formData.descChi" />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Label (English)" prop="descEng" required>
            <tiny-input v-model="formData.descEng" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Mapped Field" prop="mappedField" required>
            <tiny-input v-model="formData.mappedField" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
    <div v-if="pageTitle === 'Update'">
      <div class="page-title">
        <span class="title">Template</span>
        <el-button type="primary" @click="handleOpen(true)">Create New</el-button>
      </div>
      <tiny-grid ref="colGridRef" :data="tableData">
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
            <span style="cursor: pointer" @click="handleOpen(false, data.row)">
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
    <!-- template add/edit提示彈框 -->
    <TemplateDialog
      ref="templateDialog"
      :template-id="templateId"
      :is-add="isAdd"
      :query-chi="queryChi"
      :query-eng="queryEng"
      :area-id="route.query.areaId"
      :get-list="getTemplateData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, reactive } from "vue";
import { useRoute } from "vue-router";
import {
  Row as TinyRow,
  Col as TinyCol,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Pager as TinyPager,
} from "@opentiny/vue";
import router from "@/router";
import {
  addProArea,
  updateProArea,
  getProAreaDetails,
  getProTemplateList,
  deleteProTemplate,
} from "@/api/index";
import { ElMessage } from "element-plus";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import TemplateDialog from "@/views/problematicArea/components/templateDialog.vue";

const { colGridRef, settingId, tableName, hideBoolCol, saveSetting } =
  tableComposable();

const route = useRoute();

const templateDialog = ref()
const pageTitle = ref("");
const ruleFormRef = ref();
const formData = ref({
  descChi: "",
  descEng: "",
  mappedField: "",
});
const tableData = ref([]);
const columns = ref([
  {
    title: "Template Name (English)",
    value: "queryEng",
    width: "350"
  },
  {
    title: "Template Name (Chinese)",
    value: "queryChi",
    width: "350"
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
const sortColumn = ref("templateId");
const sortOrder = ref(0);
const form = ref({
  queryChi: '',
  queryEng: ''
})
const isAdd = ref(false)
const templateId = ref('')
const allColumns = ref("queryEng, queryChi, modifiedOn, modifiedBySnap");
const queryEng = ref('')
const queryChi = ref('')

onActivated(async () => {
  if (route.name?.includes("add")) {
    pageTitle.value = "Create";
  } else {
    pageTitle.value = "Update";
    getDetails();
    getTemplateData();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getProAreaDetails(route.query.areaId);
    if (code === 200) {
      formData.value = { ...data };
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getTemplateData() {
  try {
    let params = {
      page: pager.value.pageNum - 1,
      size: pager.value.pageSize,
      sortColumn: sortColumn.value,
      sortOrder: sortOrder.value,
      areaId: route.query.areaId
    };
    let { code, data, message } = await getProTemplateList(params);
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
      settingId.value = data.view.settingId;
      tableName.value = data.view.tableName;
      hideBoolCol(
        data.view.tableSetting === "*"
          ? allColumns.value
          : data.view.tableSetting
      );
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

function handleCancel() {
  router.go(-1);
}
async function handleSave() {
  ruleFormRef.value
    .validate()
    .then(() => {
      handleInfo();
    })
    .catch(() => {
      ElMessage.warning("Error Submit");
    });
}

async function handleInfo() {
  if (pageTitle.value === "Create") {
    try {
      const params = { ...formData.value };
      let { code, data, message } = await addProArea(params);
      if (code === 200) {
        ElMessage.success(message);
        router.go(-1);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const params = {
        ...formData.value,
        areaId: route.query.areaId,
      };
      let { code, data, message } = await updateProArea(params);
      if (code === 200) {
        ElMessage.success(message);
        router.go(-1);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function handleChange(item, modelValue) {
  if (Object.keys(form.value).includes(item)) {
    form.value[item] = modelValue;
  }
  getTemplateData();
}

const sortChangeEvent = async ({ field, order }) => {
  if (order != "") {
    sortColumn.value = field;
    sortOrder.value = order == "asc" ? 0 : 1;
  } else {
    sortColumn.value = "templateId";
    sortOrder.value = "0";
  }
  await getTemplateData();
};

function handleReset() {
  form.value = {
    queryChi: "",
    queryEng: "",
  };
  getTemplateData();
}

function handleOpen(params, data) {
  isAdd.value = params
  templateId.value = params ? '' : data.templateId
  queryChi.value = params ? '' : data.queryChi
  queryEng.value = params ? '' : data.queryEng
  templateDialog.value.openDialog();
}

async function handleDelete(row) {
  try {
    let { code, data, message } = await deleteProTemplate(row.templateId);
    if (code === 200) {
      ElMessage.success(message);
      getTemplateData();
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}
</script>
