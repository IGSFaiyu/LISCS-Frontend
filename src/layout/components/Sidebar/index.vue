<template>
  <div>
    <el-scrollbar :height="scroHeight">
      <SidebarMenu :menu-list="permissionStore.routes" base-path />
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { usePermissionStore } from "@/store";
import { ref } from "vue"
const permissionStore = usePermissionStore();
const scroHeight = ref(window.innerHeight - 100)
</script>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
  }
}
</style>
