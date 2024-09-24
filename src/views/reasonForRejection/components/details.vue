<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Reason For Rejection - {{ pageTitle }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Label (English)" prop="internalDesc" required>
            <tiny-input v-model="formData.internalDesc" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
    <div>
      <div class="page-title">
        <span class="title">Module</span>
        <el-button type="primary" @click="handleAdd">Create New</el-button>
      </div>
      <tiny-grid :data="tableData">
        <tiny-grid-column
          v-for="(item, index) in columns"
          :field="item.value"
          :title="item.title"
          :key="index"
        />
        <tiny-grid-column title="Action" align="center" width="100">
          <template #default="data">
            <div>
              <span style="cursor: pointer" @click="handleEdit()">
                <img src="@/assets/images/edit.png" />
              </span>
              <span>
                <confirm-delete :data="data" @delete-method="handleDelete(data.row)" />
              </span>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
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
} from "@opentiny/vue";
import router from "@/router";
import { saveReason, updateReason } from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const pageTitle = ref("");
const ruleFormRef = ref();
const formData = ref({
  internalDesc: "",
});
const tableData = ref([]);
const columns = ref([
  {
    title: "Module Name (English)",
    value: "titleEng",
  },
  {
    title: "Module Name (Chinese)",
    value: "titleChi",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
  },
  {
    title: "Modified By",
    value: "modifiedBy",
  },
]);

onActivated(async () => {
  if (route.name?.includes("add")) {
    pageTitle.value = "Create";
  } else {
    pageTitle.value = "Update";
    formData.value.internalDesc = route.query.internalDesc
  }
});


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
      const params = {
        ...formData.value,
        reasonId: '',
      };
      let { code, data, message } = await saveReason(params);
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
        reasonId: route.query.reasonId,
      };
      let { code, data, message } = await updateReason(params);
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


</script>
