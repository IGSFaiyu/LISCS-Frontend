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
        path: "/uploadPDFForm",
        name: "Upload PDF Form",
        component: () => import("@/views/applications/uploadPDFForm/index.vue"),
        meta: { title: "Upload PDF Form", icon: "mdi-icon-file-document-outline", },
      },
    ],
  },
  {
    path: "/mangement",
    component: Layout,
    redirect: "noredirect",
    meta: { title: "Mangement", icon: "mdi-icon-file-chart-outline" },
    children: [
      {
        path: "/",
        redirect: "noredirect",
        meta: { title: "Mangement", },
        children: [
          {
            path: "/pendingList",
            name: "Pending Approval List",
            component: () => import("@/views/applicant/index.vue"),
            meta: { title: "Pending Approval List", icon: "mdi-icon-file-document-plus-outline", },
          },
        ]
      },
    ],
  },
  {
    path: "/setting",
    component: Layout,
    redirect: "noredirect",
    meta: { title: "System Maintenance", icon: "mdi-icon-cog-outline" },
    children: [
      {
        path: "/setting",
        name: "setting",
        component: () => import("@/views/setting/index.vue"),
        meta: {
          title: "General Setting", icon: "mdi-icon-menu"
        },
      },
      // {
      //   path: "/",
      //   redirect: "/reasonForRejection",
      //   meta: { title: "ReasonForRejection" },
      //   children: [
      //     {
      //       path: "/reasonForRejection",
      //       name: "reasonForRejection",
      //       component: () => import("@/views/reasonForRejection/index.vue"),
      //       meta: { title: "Reason For Rejection", icon: "el-icon-WarnTriangleFilled" },
      //     },
      //     {
      //       path: "/addReason",
      //       name: "addReason",
      //       component: () =>
      //         import("@/views/reasonForRejection/components/details.vue"),
      //       meta: { hidden: true, title: "Add addReason" },
      //     },
      //     {
      //       path: "/editReason",
      //       name: "editReason",
      //       component: () =>
      //         import("@/views/reasonForRejection/components/details.vue"),
      //       meta: { hidden: true, title: "Edit addReason" },
      //     },
      //   ],
      // },
      // {
      //   path: "/internalUser",
      //   redirect: "noredirect",
      //   meta: { title: "Internal User", icon: "mdi-icon-account-multiple-outline" },
      //   children: [
      //     {
      //       path: "/internalUserManagement",
      //       name: "internalUserManagement",
      //       component: () => import("@/views/internalUser/index.vue"),
      //       meta: { title: "Internal User Management" },
      //     },
      //     {
      //       path: "/editInternalUser",
      //       name: "editInternalUser",
      //       component: () => import("@/views/internalUser/components/details.vue"),
      //       meta: { hidden: true, title: "Edit Internal User" },
      //     },
      //     {
      //       path: "/addInternalUser",
      //       name: "addInternalUser",
      //       component: () => import("@/views/internalUser/components/details.vue"),
      //       meta: { hidden: true, title: "Add Internal User" },
      //     },
      //   ],
      // },
    ],
  },
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
