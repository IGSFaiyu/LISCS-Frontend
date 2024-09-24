<template>
  <div class="app-container">
    <div class="page-title">
      <span class="title">Edit Letter Template</span>
    </div>
    <div class="view-letter">
      <el-form :model="form" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Language" prop="language">
              <el-input v-model="form.language" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Letter Template" prop="template">
              <el-select v-model="form.template" disabled>
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
        <el-form-item label="Subject" prop="subject">
          <el-input v-model="form.subject" />
        </el-form-item>
        <!-- <el-form-item prop="templateBody">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="form.templateBody"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item> -->
      </el-form>
      <div style="float: right;">
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated, computed } from "vue";
import router from "@/router";
import { getReviewList, getMailDetail } from "@/api/index";
import { tableComposable } from "@/composables/table.js";
import { useRoute } from "vue-router";
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// import { i18nChangeLanguage } from "@wangeditor/editor";
// import { Boot } from "@wangeditor/editor";
// import { MyDropPanelMenu } from "@/plugins/MyDropPanelMenu";
// import "@wangeditor/editor/dist/css/style.css"; // 引入 css
const route = useRoute();
const form = ref({
  language: "",
  template: "Acknowledgement",
  subject: "",
  templateBody: "",
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

onActivated(async () => {
});

// const editorRef = shallowRef();
// const mode = "default";
// //  工具栏配置
// const toolbarConfig = {
//   insertKeys: {},
// };
// // 编辑器配置
// const editorConfig = {
//   MENU_CONF: {
//     uploadImage: {
//       base64LimitSize: 5 * 1024, // 5kb
//     },
//   },
// };
// editorConfig.MENU_CONF["uploadImage"] = {
//   // 小于该值就插入 base64 格式（而不上传），默认为 0
//   base64LimitSize: 5 * 1024, // 5kb
// };
// i18nChangeLanguage("en");

// // 注册自定义按钮
// const varInsertMenuConf = {
//   key: "variable-insert",
//   factory() {
//     return new MyDropPanelMenu();
//   },
// };

// // 注册菜单到 wangEditor
// Boot.registerMenu(varInsertMenuConf);

// // 插入菜单到工具栏
// toolbarConfig.insertKeys = {
//   index: 0,
//   keys: ["variable-insert"],
// };

// // 编辑器加载
// const handleCreated = (editor) => {
//   editorRef.value = editor; // 记录 editor 实例，重要！
// };

// // 组件销毁时，也及时销毁编辑器
// onBeforeUnmount(() => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.destroy();
// });

function handleSave() {}

function handleCancel() {
  router.go(-1);
}
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
