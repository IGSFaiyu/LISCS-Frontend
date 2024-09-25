<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title"> Upload PDF </span>
    </div>
    <tiny-file-upload
      drag
      multiple
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
import { FileUpload as TinyFileUpload, Modal } from '@opentiny/vue';
import { iconFileupload } from '@opentiny/vue-icon';
import { ElMessage } from "element-plus";

const TinyIconFileupload = iconFileupload();

const fileList = ref([]);

const submitPDF = ()=>{
  ElMessage.success('Success');
};

const goBack = ()=>{
  ElMessage.success('Success');
};
</script>

<style lang="scss" scoped></style>
