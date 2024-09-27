<template>
  <div>
    <Choose v-if="type === 'new' && !isSaved" @changeType="changeType" />
    <div v-else>
      <div class="page-title" v-if="isSaved">
        <span class="title"
          >Application ID.：{{
            currentApplicationId || history?.state?.applicationId
          }}</span
        >
        <span class="title">{{
          type ===
          "Labour Importation Scheme for the Construction Sector Application Form"
            ? "Labour Importation Scheme for the Construction Sector Application Form"
            : "(b)	Annex I – Particulars of Employer(s) of the Imported Labour "
        }}</span>
      </div>
      <div class="page-form">
        <el-divider v-if="isSaved && activeName === 'internalAttachments'" />
        <section class="form-info" v-if="isSaved && activeName === 'internalAttachments'">
          <div v-for="item in info1" :key="item.id" class="form-info-content">
            <span class="form-info-content-label">{{
              item.name !== "" ? item.name + " :" : ""
            }}</span>
            <span class="form-info-content-value">{{ item.value }}</span>
          </div>
        </section>
        <el-divider v-if="isSaved" />
        <section>
          <div class="page-title">
            <span class="title" style="font-size: 20px">Form workflow</span>
          </div>
          <div class="statusBar">
            <div class="statusItems">
              <div
                class="bigStatus"
                :style="` width: 121px; background-color: ${getBigStatus(1).color};`"
              >
                <span>{{ getBigStatus(1).label }}</span>
              </div>
              <div
                class="bigStatus"
                :style="` width: 284px; background-color: ${getBigStatus(5).color};`"
              >
                <span>{{ getBigStatus(5).label }}</span>
              </div>
              <div
                class="bigStatus"
                :style="` width: 71px; background-color: ${getBigStatus(6).color};`"
              >
                <span>{{ getBigStatus(6).label }}</span>
              </div>
              <div
                class="bigStatus"
                :style="` width: 142px; background-color: ${getBigStatus(8).color};`"
              >
                <span>{{ getBigStatus(8).label }}</span>
              </div>
              <div
                class="bigStatus"
                :style="` width: 71px; background-color: ${getBigStatus(9).color};`"
              >
                <span>{{ getBigStatus(9).label }}</span>
              </div>
            </div>
          </div>

          <div class="statusBar">
            <div
              class="statusItems"
              v-for="(item, index) in statusCode"
              :style="`background-color: ${getBigStatus(index).color}`"
            >
              <div class="statusArrow" v-if="index > 0 && item.value != 10">
                <tiny-icon-arrow-right class="tiny-svg-size icon-fileupload" />
              </div>
              <div
                v-if="item.value != 10"
                :class="`statusBall ${
                  info2.filter((el) => el.label == 'internalStatus')[0].value ==
                  item?.label
                    ? 'currentStatus'
                    : ' test'
                }`"
                :title="item.label"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </section>
        <el-divider v-if="isSaved" />
        <section class="form-info" v-if="isSaved">
          <div v-for="item in info2" :key="item.id" class="form-info-content">
            <span class="form-info-content-label">{{ item.name + " :" }}</span>
            <span class="form-info-content-value">{{ item.value }}</span>
          </div>
        </section>
        <div class="form-content" style="margin-top: 1rem">
          <Applicant
            v-if="activeName === 'applicant'"
            :type="type"
            :isSaved="isSaved"
            :currentApplicationId="currentApplicationId"
            :applicationType="applicationType"
            @changeIsSaved="changeIsSaved"
            @getApplicationInfoFunction="getApplicationInfoFunction"
            @changeType="changeType"
          />
          <Course
            v-else-if="activeName === 'course'"
            :type="type"
            :currentApplicationId="currentApplicationId"
            :applicationType="applicationType"
            @changeType="changeType"
          />
          <Attachment
            v-else-if="activeName === 'internalAttachments'"
            :type="type"
            :currentApplicationId="currentApplicationId"
            :applicationType="applicationType"
            @changeType="changeType"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { watch, onActivated, ref, onDeactivated } from "vue";
import Applicant from "./components/applicant.vue";
import Course from "./components/course.vue";
import Choose from "./components/choose.vue";
import Attachment from "./components/attachment.vue";
import statusCode from "../../assets/statusCode.json";
import { getApplicationInfo, getApplicantDetailApi } from "@/api/index";

import { iconArrowRight } from '@opentiny/vue-icon';
import router from "@/router";

const TinyIconArrowRight = iconArrowRight();

const info1 = ref([
  {
    id: "1",
    name: "Applicant Name",
    value: "",
    isAlone: false,
    label: "applicantName",
  },
  {
    id: "2",
    name: "HK ID",
    value: "",
    isAlone: false,
    label: "HKID",
  },
  {
    id: "6",
    name: "",
    value: "",
  },
  {
    id: "3",
    name: "Total Claimable Amount",
    value: "",
    isAlone: true,
    label: "totalClaimableAmount",
  },
  {
    id: "4",
    name: "Claim Amount in progress",
    value: "",
    isAlone: false,
    label: "claimAmount",
  },
  {
    id: "5",
    name: "Remainding Balance",
    value: "",
    isAlone: false,
    label: "balance",
  },
]);
const info2 = ref([
  {
    id: "6",
    name: "Applicantion No.",
    value: "",
    label: "applicationNo",
  },
  {
    id: "7",
    name: "Submit Type",
    value: "",
    label: "submitType",
  },
  {
    id: "10",
    name: "Internal Status",
    value: "",
    label: "internalStatus",
  },
  {
    id: "11",
    name: "External Status",
    value: "",
    label: "externalStatus",
  },
]);

const tabInfo = ref([
  {
    label: "Applicant",
    name: "applicant",
    filter: false,
  },
  {
    label: "Course",
    name: "course",
    filter: true,
  },
  {
    label: "Attachments(Internal)",
    name: "internalAttachments",
    filter: true,
  },
]);

const activeName = ref("applicant");
const currentApplicationId = ref(null);
let isSaved = ref(false);

const type = ref("new");
const applicationType = ref("");

/* watch(activeName, (newV) => {
  console.log(newV, "watch");
}); */

onActivated(() => {
  // if have application id
  if (history.state.applicationId) {
    getApplicationInfoFunction(history.state.applicationId);
    isSaved.value = true;
    getApplicantDetail();
  }
});

onDeactivated(() => {
  activeName.value = "applicant";
});

const getApplicationInfoFunction = async (params) => {
  try {
    const { code, data, message } = await getApplicationInfo(params);
    if (code === 200) {
      info2.value = info2.value.map((item) => ({
        ...item,
        value: data[item.label],
      }));
      applicationType.value = data?.internalStatus;
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  }
};

const getApplicantDetail = async () => {
  try {
    const { code, data, message } = await getApplicantDetailApi(
      history.state.applicationId
    );
    if (code === 200) {
      info1.value = info1.value.map((item) => ({
        ...item,
        value: data[item.label],
      }));
    } else ElMessage.error(message);
  } catch (e) {
    console.log(e);
  }
};
const handleAdd = () => {
  console.log("handleAdd");
};

const fillByOCR = () => {
  console.log("fillByOCR");
};

const changeType = (params) => {
  // console.log(params, "changeType");
  if(params == "Upload PDF Form"){
    router.push({
      path: "/uploadPDFForm"
    })
  }else if (params){
    type.value = params;
  }else{
    type.value = "new";
  }
};

const changeIsSaved = (saved, applicationId) => {
  isSaved.value = saved;
  currentApplicationId.value = applicationId;
};

const getBigStatus=(index)=>{
  let status = {label: '', color: ''};
  if (index <2){
    status = {label: 'Submitted',color: 'rgb(255 242 229)'};
  }else if(index < 6){
    status = {label: 'Processing',color: 'rgb(255 242 204)'};
  }else if(index < 7){
    // color = 'rgb(218 232 252)';
    status = {label: 'Follow up action',color: 'rgb(225 213 231)'};
  }else if(index < 9){
    status = {label: 'Endorsed',color: 'rgb(205 235 139)'};
  }else{
    status = {label: 'Approved',color: 'rgb(215 241 242)'};
  }
  return status;
}
</script>

<style lang="scss" scoped></style>
