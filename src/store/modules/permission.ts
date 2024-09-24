import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import { RouteVO } from "@/api/menu/model";
import { ref } from "vue";
import { defineStore } from "pinia";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

const getMenuRes = ref({
  code: 200,
  message: null,
  data: [],
});

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 角色【超级管理员】拥有所有权限，忽略校验
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(role);
      }
    });
  }
  return false;
};

/**
 * 递归过滤有权限的动态路由
 *
 * @param routes 接口返回所有的动态路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的动态路由
 */
const filterAsyncRoutes = (routes) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw; // 深拷贝 route 对象 避免污染
    // 如果是顶级目录，替换为 Layout 组件
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout;
    } else {
      // 如果是子目录，动态加载组件
      const component = modules[`../../views/${tmpRoute.component}.vue`];
      if (component) {
        tmpRoute.component = component;
      } else {
        tmpRoute.component = modules[`../../views/error-page/404.vue`];
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(route.children);
    }

    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};
// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }

  function generateRoutes() {
    const menuRes = getMenuRes;
    return new Promise((resolve) => {
      const accessedRoutes = filterAsyncRoutes(menuRes.value.data);
      accessedRoutes.push({
        path: "/:pathMach(.*)",
        redirect: "/404",
        hidden: true,
        menuId: -999,
      });
      setRoutes(accessedRoutes);
      resolve(accessedRoutes);
    });
  }
  return {
    routes,
    setRoutes,
    generateRoutes,
  };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
