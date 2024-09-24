<template>
  <el-dialog v-model="dialogVisible" :title="title" :show-close="false">
    <el-form ref="formRef" :model="form" label-position="top">
      <el-form-item label="Template Name (English)" prop="queryEng" required>
        <el-input v-model="form.queryEng" placeholder=" " />
      </el-form-item>
      <el-form-item label="Template Name (Chinese)" prop="queryChi" required>
        <el-input v-model="form.queryChi" placeholder=" " />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps, watch } from "vue";
import { addProTemplate, updateProTemplate } from "@/api/index";

const props = defineProps({
  templateId: {
    type: String,
  },
  isAdd: {
    type: Boolean,
  },
  queryEng: {
    type: String,
  },
  queryChi: {
    type: String,
  },
  areaId: {
    type: String,
  },
  getList: {
    type: Function,
  },
});

const formRef = ref();
const form = ref({
  queryEng: "",
  queryChi: "",
});
const dialogVisible = ref(false);
const title = ref("");

watch(
  props,
  (val) => {
    form.value.queryEng = val.queryEng;
    form.value.queryChi = val.queryChi;
    title.value = val.isAdd ? "Add" : "Update";
  },
  { deep: true, immediate: true }
);

function openDialog() {
  dialogVisible.value = true;
}

async function handleConfirm() {
  formRef.value
    .validate()
    .then(() => {
      handleSubmit()
    })
    .catch(() => {
      ElMessage.warning("Error Submit");
    });
}

async function handleSubmit() {
  try {
        const params = {
          queryChi: form.value.queryChi,
          queryEng: form.value.queryEng,
          templateId: props.isAdd ? "" : props.templateId,
          areaId: props.areaId,
        };
        let { code, data, message } = await(
          props.isAdd ? addProTemplate : updateProTemplate
        )(params);
        if (code === 200) {
          ElMessage.success(message);
          dialogVisible.value = false;
          props.getList();
        } else {
          ElMessage.error(message);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      }
}

defineExpose({ openDialog });
</script>
