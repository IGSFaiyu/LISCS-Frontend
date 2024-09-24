<template>
  <div class="app-container applicantion-list">
    <!-- <div class="info-tab">
      <div
        :class="activeName === 'info' ? 'isActive' : ''"
        class="tab-item"
        @click="handleClick('info')"
      >Applicant Information</div>
      <div
        :class="activeName === 'past' ? 'isActive' : ''"
        class="tab-item"
        @click="handleClick('past')"
      >Past Applications</div>
    </div> -->
    <div>
      <!-- <ApplicantList v-if="activeName === 'info'" :applicantId="route.query.applicantId" /> -->
      <Applicant
            v-if="true"
            :type="type"
            :isSaved="isSaved"
            :currentApplicationId="route.query.applicantId"
            :applicationType="applicationType"
            @changeIsSaved="changeIsSaved"
            @getApplicationInfoFunction="getApplicationInfoFunction"
            @changeType="changeType"
          />
      <!-- <PastApplication v-if="activeName === 'past'" :applicantId="route.query.applicantId" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
} from "@opentiny/vue";
import router from "@/router";
import Applicant from "../../applications/components/applicant.vue";
import ApplicantList from "@/views/applicant/components/list.vue";
import PastApplication from "@/views/applicant/components/pastApplication.vue";
import { useRoute } from "vue-router";
const route = useRoute();

const applicationType = ref("Form 1");
const activeName = ref("");
const tableData = ref([
  {
    email: "1233@qq.com",
  },
]);
const columns = ref([
  {
    title: "Application Number",
    value: "email",
  },
  {
    title: "Last Update  Date",
    value: "title",
  },
  {
    title: "Internal Status",
    value: "internalStatus",
  },
  {
    title: "MATF Course / Examination Code",
    value: "courseCode",
  },
  {
    title: "Name of Course Provider / Examination Authority",
    value: "courseProvider",
  },
  {
    title: "Course / Examination Title",
    value: "courseTitleEng",
  },
  {
    title: "Claim Amount (HKD)",
    value: "approvedAmount",
  },
]);

watch(
  route,
  (val) => {
    if (val.query.applicantId) {
      activeName.value = 'info'
    }
  },
  { deep: true, immediate: true }
);

function handleClick(type) {
  activeName.value = type;
}

const changeIsSaved = (saved, applicationId) => {
  // isSaved.value = saved;
  // currentApplicationId.value = applicationId;
};

const getApplicationInfoFunction = async (params) => {
  try {
    // const { code, data, message } = await getApplicationInfo(params);
    // if (code === 200) {
    //   info2.value = info2.value.map((item) => ({
    //     ...item,
    //     value: data[item.label],
    //   }));
    //   applicationType.value = data?.internalStatus;
    // } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  }
};

const changeType = (params) => {
  // // console.log(params, "changeType");
  // if (params) type.value = params;
  // else type.value = "new";
};

</script>

<style lang="scss">
.el-icon {
  margin-right: 10px;
}
.applicantion-list {
  .info-tab {
    display: flex;
    .tab-item {
      padding: 15px 30px;
      border-radius: 5px 5px 0 0;
      font-weight: 600;
    }
  }
  .isActive {
    background-color: #eaeaea;
  }
}
</style>
