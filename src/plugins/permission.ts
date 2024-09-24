import router from "@/router";
import { useUserStore, usePermissionStore } from "@/store";
// import NProgress from "@/utils/nprogress";
import { RouteRecordRaw } from "vue-router";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login", "401", "404"];

  router.beforeEach(async (to, from, next) => {
    // NProgress.start();
    const hasToken = sessionStorage.getItem(TOKEN_KEY);
    // console.log(hasToken, "hasToken");
    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转首页
        next({ path: "/" });
        // NProgress.done();
      } else {
        const userStore = useUserStore();
        const permissionStore = usePermissionStore();
        const accessRoutes = await permissionStore.generateRoutes();
        accessRoutes?.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });
        next();
      }
    } else {
      // 未登录可以访问白名单页面
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
        // NProgress.done();
      }
    }
  });

  router.afterEach(() => {
    // NProgress.done();
  });
}
