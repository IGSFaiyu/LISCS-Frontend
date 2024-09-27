<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">InternalUser - {{ title }}</span>
      <div>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button plain @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="AD Name" prop="adName">
            <tiny-input
              class="readonly-input"
              v-model="formData.adName"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <tiny-form-item label="Email Address" prop="emailAddress">
            <tiny-input
              class="readonly-input"
              v-model="formData.rank"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Name" prop="nameEng">
            <tiny-input
              class="readonly-input"
              v-model="formData.nameEng"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="5">
          <!-- division -->
          <tiny-form-item label="Division" prop="divisionArr">
            <tiny-select
              class="my-select-input"
              v-model="formData.divisionArr"
              placeholder="please select"
              :options="divisionOptions"
              multiple
            >
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row :flex="true">
        <tiny-col :span="5">
          <tiny-form-item label="Post" prop="post">
            <tiny-input
              class="readonly-input"
              v-model="formData.post"
              display-only
            />
          </tiny-form-item>
        </tiny-col>

        <tiny-col :span="5">
          <!-- role -->
          <tiny-form-item label="Role" prop="roleId">
            <tiny-select
              class="my-select-input"
              v-model="formData.roleId"
              :options="roleOptions"
            >
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, reactive } from "vue";
import { useRoute } from "vue-router";
import {
  Row as TinyRow,
  Col as TinyCol,
  Form as TinyForm,
  Select as TinySelect,
  FormItem as TinyFormItem,
  Input as TinyInput,
} from "@opentiny/vue";
import router from "@/router";
import { updateInternalUser, getInternalUserDetails } from "@/api/index";
import { getRoleList } from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
let formData = ref({
  adName: "",
  nameEng: "",
  nameChi: "",
  division: "",
  divisionArr: [],
  roleId: "",
});
const routeName = ref(route.name);
const roleOptions = ref([]);
const divisionOptions = ref([
  { label: "Admin", value: "A" },
  { label: "Internal user", value: "I" },
  { label: "External User", value: "E" },
]);
onActivated(async () => {
  getRoleListData();
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
  }
});

async function getRoleListData() {
  try {
    let params = { size: 100 };
    let { code, data, message } = await getRoleList(params);
    if (code === 200) {
      if (data.length > 0) {
        const result = data.map((item) => {
          return {
            label: item.descEng,
            value: item.roleId,
          };
        });
        roleOptions.value = result;
      }
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
}
async function getDetails() {
  try {
    let { code, data, message } = await getInternalUserDetails(
      route.query.userId
    );
    if (code === 200) {
      const result = {
        ...data,
        divisionArr: data.division === "" ? [] : data.division.split(","),
      };

      formData.value = result;
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
  if (title.value === "Create") {
  } else {
    try {
      const params = {
        ...formData.value,
        userId: route.query.userId,
        division: formData.value.divisionArr.join(","),
      };
      let { code, data, message } = await updateInternalUser(params);
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
<style lang="less" scoped>
::v-deep.tiny-form-item {
  .tiny-form-item__label {
    // font-family: IBM Plex Sans;
    font-size: 16px;
    font-weight: 500;
    line-height: 23.04px;
    text-align: left;
    color: #6f7482;
  }
}
.readonly-input {
  background-color: #b9b9b9;
  padding: 0 10px;
  height: 48px;
  line-height: 48px;
  border-radius: 4px;
  font-size: 16px;
}
::v-deep.my-select-input {
  .tiny-select__tags-group {
    .tiny-select__tags {
      height: 48px;
      .tiny-tag {
        height: 30px;
        border-radius: 4px;
        margin-right: 12px;
        color: #333333;
      }
    }
    .tiny-input.tiny-input-suffix {
      height: 48px;
      .tiny-input-display-only {
        input {
          height: 48px;
          border-radius: 5px;
          border-width: 1px;
          border-color: #f5f5f5;
        }
        .tiny-input-inner {
          height: 48px;
          border-radius: 5px;
          border-width: 1px;
          border-color: #f5f5f5;
        }
      }
      div {
        .tiny-input__suffix {
          top: 25px;
        }
      }
    }
  }
}
</style>
