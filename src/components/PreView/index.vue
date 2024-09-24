<template>
  <div style="position: relative; padding-top: 30px" v-loading="loading">
    <!-- 图片及pdf的预览 -->
    <div v-if="fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png'">
      <img
        :src="fileContent"
        style="
          max-width: 100%;
          max-height: 100%;
          display: block;
          margin: 0 auto;
        "
        alt="failed"
      />
    </div>
    <vue-office-pdf v-if="fileType === 'pdf'" :src="fileContent" />
    <!-- <el-icon
      v-if="fileType"
      style="
        position: absolute;
        top: 0px;
        right: 0px;
        color: red;
        font-size: 20px;
        cursor: pointer;
      "
      @click="handleDelete"
    >
      <Delete />
    </el-icon> -->
  </div>
</template>

<script setup>
import { ref, defineExpose, defineProps, watch } from "vue";
import VueOfficePdf from "@vue-office/pdf";
import { preViewFile /* deleteFile */ } from "@/api/index";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const fileType = ref("");
const fileContent = ref(null);

const loading = ref(false);

const id = ref("");
const name = ref("");

const props = defineProps({
  fileName: {
    type: String,
  },
  applicationId: {
    type: Number,
  },
  getFileList: {
    type: Function,
  },
});

watch(
  props,
  (val) => {
    if (val.applicationId && val.fileName) {
      // console.log(val.fileName, "fileName", val.applicationId, "applicationId");
      // console.log(val, "val");
      GetFile(val);
    }
  },
  { deep: true, immediate: true }
);

async function GetFile(val) {
  // console.log(val.fileName, "file name");
  loading.value = true;
  id.value = val.applicationId;
  name.value = val.fileName;
  fileType.value = val.fileName?.split(".")[1];

  let newFileName = "";
  if (val.fileName.includes("{") || val.fileName.includes("}"))
    newFileName = val.fileName.replace("{", "%7B").replace("}", "%7D");
  else newFileName = val.fileName;

  try {
    let res = await preViewFile(val.applicationId, newFileName);
    fileContent.value = window.URL.createObjectURL(res);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

async function handleDelete() {
  console.log("handle delete");
  /* try {
    const params = {
      applicationId: id.value,
      fileName: name.value,
    };
    let { code, message } = await deleteFile(params);
    if (code === 200) {
      props.getFileList();
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  } */
}

defineExpose({ GetFile });
</script>
