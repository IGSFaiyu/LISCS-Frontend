<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Review Letter</span>
    </div>
    <tiny-grid ref="colGridRef" :data="tableData" @sort-change="sortChangeEvent" remote-sort>
      <template #toolbar>
        <tiny-grid-toolbar
          id="custom-width"
          :resizable="{ storage: true }"
          :setting="{
            storage: 'local'
          }"
        />
      </template>
      <tiny-grid-column
        v-for="(item, index) in columns"
        :field="item.value"
        :title="item.title"
        :key="index"
        sortable
        align="center"
        :width="item.width"
      >
        <template #default="data">
          <div v-if="data.row._$index_ === '1' && (Object.keys(form).includes(item.value))">
            <tiny-input
              v-model="form[item.value]"
              placeholder="Search"
              @input="handleChange(item.value, form[item.value])"
            />
          </div>
          <div v-else>{{ data.row[item.value] }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="Action" align="center" width="100" fixed="right">
        <template #default="data">
          <div v-if="data.row._$index_ !== '1'">
            <el-button type="primary" @click="handleEdit(data.row)">Details</el-button>
          </div>
          <div v-else>
            <el-button @click="handleReset">Reset</el-button>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager
      align="right"
      :current-page="pager.pageNum"
      :page-size="pager.pageSize"
      :total="pager.total"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, prev, pager, next, jumper, sizes"
      @current-change="changeCurrent"
      @size-change="changeSize"
    />
    <div class="view-letter">
      <el-form :model="letterForm" label-position="top">
        <el-form-item
          v-if="route.query.templateType === 'Query'"
          label="Problematic Area"
          prop="area"
          style="position: relative;"
        >
          <el-select v-model="letterForm.area" multiple disabled>
            <el-option
              v-for="item in areaOptions"
              :key="item.natureId"
              :label="item.descChi"
              :value="item.natureId"
            />
          </el-select>
          <el-button v-if="isSave" type="primary" style="position: absolute; right: -150px;" @click="isSave = true">Save</el-button>
          <el-button v-else type="primary" style="position: absolute; right: -150px;" @click="">Update</el-button>
        </el-form-item>
        <div v-if="!isSave">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Status" prop="sendStatus">
                <el-input v-model="letterForm.sendStatus" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Letter Template" prop="template">
                <el-select v-model="letterForm.template" disabled>
                  <el-option
                    v-for="item in templateOptions"
                    :key="item.natureId"
                    :label="item.descChi"
                    :value="item.natureId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="To" prop="to">
            <el-input v-model="letterForm.to" />
          </el-form-item>
          <el-form-item label="Cc" prop="cc">
            <el-input v-model="letterForm.cc" />
          </el-form-item>
          <el-form-item label="Bcc" prop="bcc">
            <el-input v-model="letterForm.bcc" />
          </el-form-item>
          <el-form-item label="Subject" prop="subject">
            <el-input v-model="letterForm.subject" />
          </el-form-item>
          <el-form-item
            v-if="route.query.templateType !== 'Acknowledgement' && route.query.templateType !== 'Query'"
            label="Preset Attachment"
            prop="presetAttachment"
          >
            <el-input v-model="letterForm.presetAttachment" disabled style="position: relative;" />
            <el-button style="position: absolute; right: -78px;">Review</el-button>
          </el-form-item>
          <el-form-item label="Attachment(Total 10MB Max)" prop="presetAttachment">
            <el-upload :http-request="(val) => requestUpload" accept=".pdf" :show-file-list="false">
              <el-button style="width: 300px;">
                <el-icon>
                  <UploadFilled />
                </el-icon>
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="body">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 500px; overflow-y: hidden"
                v-model="letterForm.body"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
              />
            </div>
          </el-form-item>
        </div>
        <div v-else>
          表格  ---- table
        </div>
      </el-form>
      <div style="display: flex; padding: 10px 0">
        <el-button type="primary" @click="regenerateVisible = true">Regenerate</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button
          v-if="letterForm.sendStatus === 'preparing'"
          type="primary"
          @click="handleConfirm"
        >Confirm</el-button>
        <el-button type="primary" @click="handlePrint">Print</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </div>
    </div>
    <!-- Regenerate 確認彈框 -->
    <el-dialog
      v-model="regenerateVisible"
      title="Tip"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div style="font-size: 1.2rem">Please confirm whether to perform a regeneration operation.</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleRegenerate">Confirm</el-button>
          <el-button @click="regenerateVisible = false">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onActivated, computed } from "vue";
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  GridToolbar as TinyGridToolbar,
  Input as TinyInput,
  Pager as TinyPager,
  Select as TinySelect,
  Option as TinyOption,
} from "@opentiny/vue";
import router from "@/router";
import ConfirmDelete from "@/components/confirmDeleteButton/index.vue";
import {
  getReviewList,
  getMailDetail,
  regenerateMail,
  confirmMail,
  saveMail,
} from "@/api/index";
import { timestampToTime } from "@/utils/formatTime.js";
import { tableComposable } from "@/composables/table.js";
import { useRoute } from "vue-router";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { i18nChangeLanguage } from "@wangeditor/editor";
import { Boot } from "@wangeditor/editor";
import { MyDropPanelMenu } from "@/plugins/MyDropPanelMenu";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
const route = useRoute();

const tableData = ref([]);
const form = ref({
  applicant: "",
  courseCode: "",
  courseProvider: "",
  courseTitleEng: "",
});
const columns = ref([
  {
    title: "Application Number",
    value: "applicationNumber",
    width: "300",
  },
  {
    title: "Last Update Date",
    value: "modifiedOn",
    width: "250",
  },
  {
    title: "MATF Course / Examination Code",
    value: "courseCode",
    width: "400",
  },
  {
    title: "Name of Course Provider / Examination Authority",
    value: "nameEng",
    width: "400",
  },
  {
    title: "Course / Examination Title",
    value: "courseTitleEng",
    width: "350",
  },
  {
    title: "Claim Amount (HKD)",
    value: "approvedAmount",
    width: "300",
  },
]);

const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const areaOptions = ref([]);
const regenerateVisible = ref(false);

const sortColumn = ref("applicantId");
const sortOrder = ref(0);
const letterForm = ref({
  sendStatus: "",
  template: "Acknowledgement",
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  presetAttachment: "",
  attachment: "",
  body: "",
  area: "",
});
const templateOptions = ref([
  {
    label: "Acknowledgement Letter",
    value: "Acknowledgement",
  },
  {
    label: "Query Letter",
    value: "Query",
  },
  {
    label: "StopProcessing Letter",
    value: "StopProcessing",
  },
  {
    label: "Approval Letter",
    value: "Approval",
  },
  {
    label: "Rejection Letter",
    value: "Rejection",
  },
]);
const isSave =  ref(false)

onActivated(async () => {
  await getDetail();
  await getData();
});

const editorRef = shallowRef();
const mode = "default";
//  工具栏配置
const toolbarConfig = {
  insertKeys: {},
};
// 编辑器配置
const editorConfig = {
  MENU_CONF: {
    uploadImage: {
      base64LimitSize: 5 * 1024, // 5kb
    },
  },
};
editorConfig.MENU_CONF["uploadImage"] = {
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 5 * 1024, // 5kb
};
i18nChangeLanguage("en");

// 注册自定义按钮
const varInsertMenuConf = {
  key: "variable-insert",
  factory() {
    return new MyDropPanelMenu();
  },
};

// 注册菜单到 wangEditor
Boot.registerMenu(varInsertMenuConf);

// 插入菜单到工具栏
toolbarConfig.insertKeys = {
  index: 0,
  keys: ["variable-insert"],
};

// 编辑器加载
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const getData = async () => {
  try {
    const params = {
      mailId: route.query.mailId,
    };
    let { code, data, message } = await getReviewList(params);
    if (code === 200) {
      tableData.value = data.map((item) => {
        return {
          ...item,
          modifiedOn: item.modifiedOn
            ? timestampToTime(item.modifiedOn, "YYYY-MM-DD hh:mm")
            : "",
        };
      });
      pager.value.total = data.length;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

const getDetail = async () => {
  try {
    const params = {
      mailId: route.query.mailId,
    };
    let { code, data, message } = await getMailDetail(params);
    if (code === 200) {
      letterForm.value = {
        ...data.mail,
        template: route.query.templateType,
      };
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

const sortChangeEvent = async ({ field, order }) => {
  if (order != "") {
    sortColumn.value = field;
    sortOrder.value = order == "asc" ? 0 : 1;
  } else {
    sortColumn.value = "applicantId";
    sortOrder.value = "0";
  }
  await getData();
};

function handleChange(item, modelValue) {
  if (Object.keys(form.value).includes(item)) {
    form.value[item] = modelValue;
  }
  getData();
}

function handleReset() {
  form.value = {
    applicant: "",
    courseCode: "",
    courseProvider: "",
    courseTitleEng: "",
  };
  getData();
}

function requestUpload(fileInfo, type) {
  if (fileInfo.size >= 5 * 1024 * 1024) {
    ElMessage.warning("The file size cannot exceed 5Mb");
    return;
  }
}

function handleEdit(data) {
  // 跳转至详情页 todo
  router.push('/editLetter')
}

function getParamsData() {
  const params = {
    mailId: route.query.mailId,
    to: letterForm.value.to,
    cc: letterForm.value.cc,
    bcc: letterForm.value.bcc,
    subject: letterForm.value.subject,
    body: letterForm.value.body,
  };
  return params;
}

const handleRegenerate = async () => {
  try {
    const params = getParamsData();
    let { code, data, message } = await regenerateMail(params);
    if (code === 200) {
      ElMessage.success(message);
      regenerateVisible.value = false;
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

const handleSave = async () => {
  try {
    const params = getParamsData();
    let { code, data, message } = await saveMail(params);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

const handleConfirm = async () => {
  try {
    const params = getParamsData();
    let { code, data, message } = await confirmMail(params);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log("Error fetching data:", err);
  }
};

function handlePrint() {
  router.go(-1);
}

function handleCancel() {
  router.go(-1);
}

const changeCurrent = async (current) => {
  pager.value.pageNum = current;
  await getData();
};
const changeSize = async (size) => {
  pager.value.pageSize = size;
  await getData();
};
</script>

<style lang="scss" scoped>
.search-bar {
  width: 30%;
  // margin-left: 5rem;
  span {
    display: inline-block;
    color: #6f7482;
    font-size: 18px;
    font-weight: 500;
  }
}
.view-letter {
  padding: 10px 50px;
  .el-form-item {
    width: 80% !important;
  }
  .el-button {
    flex: 1;
  }
}
</style>
