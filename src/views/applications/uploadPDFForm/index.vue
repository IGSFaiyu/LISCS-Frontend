<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title"> Upload PDF </span>
    </div>
    <tiny-file-upload
      drag
      accept=".pdf"
      :auto-upload="false"
      :file-list="fileList"
    >
      <tiny-icon-fileupload class="tiny-svg-size icon-fileupload"></tiny-icon-fileupload>
    </tiny-file-upload>

    <div style="display: flex; margin-top: 20px">
      <el-button type="primary" @click="submitPDF" class="default-button"
        >submit</el-button
      >
      <el-button type="primary" @click="goBack" class="default-button btn-secondary"
        >Cancel</el-button
      >
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, onActivated } from "vue";
import router from "@/router";
import { FileUpload as TinyFileUpload, Modal } from '@opentiny/vue';
import { iconFileupload } from '@opentiny/vue-icon';
import {sortingData} from "../../../comon.ts";
import { ElMessage } from "element-plus";
import testData from "../../../assets/testData.json";

const TinyIconFileupload = iconFileupload();

const fileList = ref([]);

const submitPDF = ()=>{
  ElMessage.success('Success');
  router.push({
    path: "/editApplications",
    state: {
      applicationId: sortingData(testData, 'createdOn', false).filter(el=>el.submitType == 0 && el.internalStatus == 0)[0].applicationId,
    },
  });
};

const goBack = ()=>{
  ElMessage.success('Success');
};
</script>

<style lang="scss" scoped></style>
