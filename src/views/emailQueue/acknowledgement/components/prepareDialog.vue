<template>
  <el-dialog v-model="dialogVisible" title=" " :show-close="false" :close-on-click-modal="false">
    <el-form :model="form" label-position="top">
      <el-form-item label="Prompt Letter Date when Prepare">
        <el-input v-model="form.prompt" placeholder=" " disabled />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Applicant Name" prop="name">
            <el-input v-model="form.name" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Letter Date (D/M/Y)" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              format="YYYY / MM / DD"
              value-format="YYYY-MM-DD"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">Prepare</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps, watch } from "vue";
import { prepareAck } from "@/api/index";
import router from "@/router";

const props = defineProps({
  applicantName: {
    type: String,
  },
  applicantId: {
    type: String,
  },
  applicationNumbers: {
    type: String,
  },
  letterTitle: {
    type: String,
  },
  category: {
    type: String,
  },
});

const form = ref({
  name: "",
  prompt: "Acknowledgement Letter",
  date: "",
});
const dialogVisible = ref(false);

watch(
  props,
  (val) => {
    form.value.name = val.applicantName;
    form.value.prompt = val.letterTitle + " Letter";
  },
  { deep: true, immediate: true }
);

function openDialog() {
  form.value.date = ''
  dialogVisible.value = true;
}

// const getPath = async () => {
//   switch (props.letterTitle) {
//     case "Acknowledgement":
//       return "/reviewAcknowledgeLetter";
//     case "Query":
//       return "/reviewQueryLetter";
//     case "StopProcessing":
//       return "/reviewProLetter";
//     case "Approval":
//       return "/reviewApprovalLetter";
//     default:
//       return "/reviewRejectionLetter";
//   }
// };

async function handleConfirm() {
  try {
    const params = {
      applicantId: props.applicantId,
      applicationNumber: props.applicationNumbers,
      letterDate: form.value.date,
      category: props.category,
    };
    let { code, data, message } = await prepareAck(params);
    if (code === 200) {
      dialogVisible.value = false;
      router.push({
        path: '/reviewLetter',
        query: {
          mailId: data.mailId,
          templateType: props.letterTitle,
        },
      });
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
}

defineExpose({ openDialog });
</script>
