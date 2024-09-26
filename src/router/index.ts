import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "Home",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
          icon: "mdi-icon-home",
        },
      },
    ],
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    meta: { hidden: true },
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
  {
    path: "/applications",
    component: Layout,
    redirect: "/newApplications",
    meta: { title: "Applications", icon: "mdi-icon-file-document-outline" },
    children: [
      {
        path: "/dashboard",
        meta: { title: "Dashboard", icon: "mdi-icon-file-document-outline" },
        component: () => import("@/views/applications/dashboard/index.vue"),
      },
      {
        path: "/newApplications",
        // redirect: "noredirect",
        meta: { title: "Create New Application", icon: "mdi-icon-file-document-outline" },
        component: () => import("@/views/applications/newApplications.vue"),
      },
      {
        path: "/editApplications",
        // redirect: "noredirect",
        meta: { hidden: true, title: "Edit Application", icon: "mdi-icon-file-document-outline" },
        component: () => import("@/views/applications/newApplications.vue"),
      },
      {
        path: "/uploadPDFForm",
        name: "Upload PDF Form",
        component: () => import("@/views/applications/uploadPDFForm/index.vue"),
        meta: { title: "Upload PDF Form", icon: "mdi-icon-file-document-outline", },
      },
    ],
  },
  {
    path: "/systemManagement",
    component: Layout,
    redirect: "/systemManagement",
    meta: { title: "Account Management", icon: "mdi-icon-cog-outline" },
    children: [
      {
        path: "/accountManagement",
        name: "Account Management",
        component: () => import("@/views/accountManagement/index.vue"),
        meta: { title: "Account Management", icon: "mdi-icon-file-document-outline", },
      },
    ],
  },
  // {
  //   path: "/setting",
  //   component: Layout,
  //   redirect: "/setting",
  //   meta: { title: "System Maintenance", icon: "mdi-icon-cog-outline" },
  //   children: [
  //     {
  //       path: "/accountManagement",
  //       name: "Account Management",
  //       component: () => import("@/views/accountManagement/index.vue"),
  //       meta: { title: "Account Management", icon: "mdi-icon-file-document-outline", },
  //     },
  //   ],
  // },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
