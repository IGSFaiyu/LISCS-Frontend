import defaultSettings from "@/settings";

// 导入 Element Plus 中英文语言包
import { store } from "@/store";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { SidebarStatusEnum } from "@/enums/SidebarStatusEnum";
import { computed, reactive } from "vue";
import { defineStore } from "pinia";

// 手动提供给 useStore() 函数 pinia 实例
// https://pinia.vuejs.org/zh/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
export function useAppStoreHook() {
  // return useAppStore(store);
}
