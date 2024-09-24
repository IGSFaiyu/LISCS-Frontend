<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Letter Template - {{ title }}</span>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" label-position="top">
      <tiny-row :flex="true">
        <tiny-col :span="3">
          <tiny-form-item label="Language" prop="language">
            <tiny-input
              class="readonly-input"
              v-model="formData.language"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <tiny-form-item label="Category" prop="category">
            <tiny-input
              class="readonly-input"
              v-model="formData.category"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <tiny-form-item label="Letter Template" prop="name">
            <tiny-input
              class="readonly-input"
              v-model="formData.name"
              display-only
            />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row :flex="true">
        <tiny-col :span="8">
          <tiny-form-item label="Subject" prop="templateSubject">
            <tiny-input class="my-input" v-model="formData.templateSubject" />
          </tiny-form-item>
        </tiny-col>
      </tiny-row>

      <tiny-row>
        <tiny-col :span="10">
          <tiny-form-item label="" prop="templateBody">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 500px; overflow-y: hidden"
                v-model="formData.templateBody"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
              />
            </div>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
    </tiny-form>
    <div class="page-footer" style="">
      <el-button type="primary" @click="handleSave">Save</el-button>
      <el-button plain @click="handleCancel">Cancel</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onActivated, reactive, shallowRef, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
  Row as TinyRow,
  Col as TinyCol,
  Form as TinyForm,
  Select as TinySelect,
  FormItem as TinyFormItem,
  Input as TinyInput,
  RichTextEditor as TinyRichTextEditor,
} from "@opentiny/vue";
import router from "@/router";
import { saveLetterTemplate, getLetterTemplateDetails } from "@/api/index";
import { ElMessage } from "element-plus";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { i18nChangeLanguage } from "@wangeditor/editor";
import { MyDropPanelMenu } from "@/plugins/MyDropPanelMenu";
import { Boot } from "@wangeditor/editor";
import { formatResponse, revertFormatVal } from "@/utils/common.js";

// 编辑器实例，必须用 shallowRef
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
    return new MyDropPanelMenu("Variable Insert", [
      "applicantName",
      "applicationNumbers",
      "letterDate",
    ]);
  },
};

// 注册菜单到 wangEditor
Boot.registerMenu(varInsertMenuConf);

// 插入菜单到工具栏
toolbarConfig.insertKeys = {
  index: 0,
  keys: ["variable-insert"],
};

const route = useRoute();

const title = ref("");
const ruleFormRef = ref();
let formData = ref({
  language: "",
  category: "",
  name: "",
  templateSubject: "",
  templateBody: "",
});
const routeName = ref(route.name);
const categoryOption = [{ label: "All", value: "" }, { label: "Aviation", value: "A" }, { label: "Martime", value: "M" }];
const languageOption = [{ label: "All", value: "" }, { label: "English", value: "en" }, { label: "繁體中文", value: "zh-TW" }];
onActivated(async () => {
  if (route.name?.includes("add")) {
    title.value = "Create";
  } else {
    title.value = "Update";
    getDetails();
  }
});

async function getDetails() {
  try {
    let { code, data, message } = await getLetterTemplateDetails(
      route.query.templateId
    );
    if (code === 200) {
      const result = {
        ...data,
        language: formatResponse(languageOption, data.language),
        category: formatResponse(categoryOption, data.category)
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
        language: revertFormatVal(languageOption, formData.value.language),
        category: revertFormatVal(categoryOption, formData.value.category),
        templateId: route.query.templateId,
      };
      let { code, data, message } = await saveLetterTemplate(params);
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
</script>
<style lang="less" scoped>
:deep(.tiny-form-item) {
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
.my-input {
  background-color: #f8fafc;
  padding: 0 10px;
  height: 48px;
  line-height: 48px;
  border-radius: 4px;
  font-size: 16px;
}
:deep(.my-input) {
  .tiny-input-display-only {
    input {
      background-color: #f8fafc;
      height: 48px;
      border: none;
      font-size: 16px;
    }
  }
}

.page-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
