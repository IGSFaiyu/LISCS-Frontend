<template>
  <div class="custom-form">
    <div class="custom-form-title">Upload Attachments</div>
    <el-form-item class="custom-form-item width-100" label="Type" prop="type">
      <el-select
        v-model="form.type"
        placeholder=""
        style="width: 30%"
        @change="form.typeOther = ''"
      >
        <el-option
          v-for="item in typeList"
          :key="item.typeId"
          :label="item.desc"
          :value="item.typeId"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="form.type === 5"
      class="custom-form-item width-100"
      label="Please specify"
      prop="specify"
    >
      <el-input v-model="form.typeOther" style="width: 50%" />
    </el-form-item>

    <el-upload
      :http-request="(val) => requestUpload(val)"
      :accept="acceptType"
      :show-file-list="false"
    >
      <el-button type="primary" :class="`default-button cancel`"
        >{{ "Upload" }}
      </el-button>
    </el-upload>

    <div class="custom-form-title" style="margin: 1rem 0 0.5rem">Internal</div>
    <el-table
      :data="internalTableData"
      style="width: 100%"
      max-height="250"
      v-loading="loading"
    >
      <el-table-column
        v-for="item in getColumns('internal')"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="scope" v-if="item.prop === 'type'">
          {{
            typeList.find((item) => item.typeId === scope.row.internalType)
              ?.desc
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button
            type="primary"
            class="default-button cancel"
            @click="handleClick('view', scope)"
          >
            View
          </el-button>
          <el-button
            type="primary"
            class="default-button cancel"
            @click="handleClick('archive', scope)"
          >
            Archive
          </el-button>
          <el-button
            type="primary"
            class="default-button cancel"
            @click="handleClick('delete', scope)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="custom-form-title" style="margin: 1rem 0 0.5rem">Archive</div>
    <el-table
      :data="archiveTableData"
      style="width: 100%"
      max-height="250"
      v-loading="loading"
    >
      <el-table-column
        v-for="item in getColumns('archive')"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
      >
        <template #default="scope" v-if="item.prop === 'type'">
          {{
            typeList.find((item) => item.typeId === scope.row.internalType)
              ?.desc
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scope">
          <el-button
            type="primary"
            class="default-button cancel"
            @click="handleClick('view', scope)"
          >
            View
          </el-button>
          <el-button
            type="primary"
            class="default-button cancel"
            @click="handleClick('delete', scope)"
          >
            Delete
          </el-button></template
        >
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="centerDialogVisible"
      title="Preview"
      width="500"
      center
      :before-close="closeDialog"
    >
      <PreviewFile
        class="upload-content-preview"
        ref="fileRef"
        :file-name="currentFilename"
        :application-id="currentApplicationId"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import {
  getAttachmentInternalTypeApi,
  getAttachmentInternalFileListApi,
  getAttachmentArchiveFileListApi,
  uploadInternaleFileApi,
  deleteFile,
  archiveFile,
} from "@/api/index";
import { ElMessage } from "element-plus";
import PreviewFile from "@/components/PreView/index.vue";

const form = ref({
  type: null,
  typeOther: "",
});
const typeList = ref([]);

const columns = ref([
  {
    id: "1",
    prop: "modifiedOn",
    label: "Upload Date",
  },
  {
    id: "2",
    prop: "modifiedBySnap",
    label: "Action Officer",
  },
  {
    id: "3",
    prop: "type",
    label: "Type",
  },
  {
    id: "4",
    prop: "filename",
    label: "Filename",
  },
]);

const internalTableData = ref([]);
const archiveTableData = ref([]);
const acceptType = ref(".pdf, .jpg, .jpeg, .png");
const currentFilename = ref("");
const centerDialogVisible = ref(false);
const loading = ref(false);

const props = defineProps({
  type: String,
  currentApplicationId: Number,
  applicationType: String,
});
const { type, currentApplicationId, applicationType } = toRefs(props);
/* console.log(
  type.value,
  currentApplicationId.value,
  applicationType.value,
  "----"
); */

onMounted(() => {
  getTypeList();
  if (currentApplicationId.value) getTableList();
});

const getTypeList = async () => {
  try {
    const { code, data, message } = await getAttachmentInternalTypeApi();
    if (code === 200) typeList.value = data;
  } catch (error) {
    console.log(error);
  }
};

const getColumns = (type) => {
  if (type === "archive")
    return columns.value.map((item) =>
      item.prop === "modifiedOn"
        ? {
            ...item,
            label: "Archive Date",
          }
        : item
    );
  return columns.value;
};

const getTableList = async () => {
  try {
    loading.value = true;
    const { code, data } = await getAttachmentInternalFileListApi(
      currentApplicationId.value
    );
    if (code === 200) internalTableData.value = data;
    const { code: archiveCode, data: archiveData } =
      await getAttachmentArchiveFileListApi(currentApplicationId.value);
    if (archiveCode === 200) archiveTableData.value = archiveData;
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

function requestUpload(fileInfo) {
  if (!form.value.type) {
    ElMessage.warning("Please select type at first");
    return;
  }
  if (fileInfo.size >= 5 * 1024 * 1024) {
    ElMessage.warning(t("message.uploadTip", { size: 5 }));
    return;
  }
  let fileData = new FormData();
  fileData.append("file", fileInfo.file);
  fileData.append("applicationId", currentApplicationId.value);
  fileData.append("typeId", form.value.type);
  fileData.append("typeOther", form.value.typeOther);
  uploadFile(fileData);
}

async function uploadFile(fileData) {
  try {
    let { code, message, data } = await uploadInternaleFileApi(fileData);
    if (code === 200) {
      ElMessage.success(message);
      getTableList();
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}

const handleClick = (params, data) => {
  switch (params) {
    case "view":
      centerDialogVisible.value = true;
      currentFilename.value = data.row?.filename;
      break;
    case "archive":
    case "delete":
      changeFile(params, data.row?.filename);
      break;

    default:
      break;
  }
};

const closeDialog = () => {
  centerDialogVisible.value = false;
  currentFilename.value = "";
};

const changeFile = async (params, fileName) => {
  try {
    const obj = {
      applicationId: currentApplicationId.value,
      fileName,
    };
    const { code, message } =
      params === "archive"
        ? await archiveFile({ ...obj })
        : await deleteFile({ ...obj });
    if (code === 200) {
      getTableList();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
