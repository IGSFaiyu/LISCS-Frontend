import { createApp } from "vue";
import App from "./App.vue";
import initI18n from "@/utils/i18n";
import router from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";
import { setupElIcons, setupPermission } from "@/plugins";
import "@mdi/font/css/materialdesignicons.min.css";
// import { BootstrapVue } from 'bootstrap-vue';

// 样式
import "@/styles/index.scss";
import "uno.css";
import "animate.css";
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);
// 全局注册Element-plus图标
setupElIcons(app);
// 注册动态路由
setupPermission();
app.use(initI18n({ locale: "enUS" }));
// app.use(BootstrapVue);
app.use(router);
app.mount("#app");
