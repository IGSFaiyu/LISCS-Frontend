<template>
  <div class="navbar">
    <div class="left">
      <img src="@/assets/images/navImage.png" />
      <!-- <div style="margin-left: 20px">
        <div style="font-style: 20px; font-weight: 500;">{{ $t("navBar.title") }}</div>
        <div style="font-size: 24px; font-weight: 800;">{{ $t("navBar.subTitle") }}</div>
      </div> -->
    </div>
    <div class="right" style="line-height: 100px; font-size: 50px;">
      <!-- <img
        src="@/assets/images/matf.png"
        style="height: 50px; vertical-align: middle"
      /> -->
      LISCS
      <!-- <lang-select class="setting-item" /> -->

      <el-dropdown class="userInfo">
        <el-button type="primary">
          {{ userinfoStr.adName }}
          <el-icon class="el-icon--right" style="margin-right: 0"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-popconfirm
                title="Are you sure to Log out this account?"
                @confirm="logoutHandler"
              >
                <template #reference>
                  <el-button> Log out</el-button>
                </template>
              </el-popconfirm>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { TOKEN_KEY, USEER_INFO_KEY } from "@/enums/CacheEnum";
import router from "@/router";
const emit = defineEmits(["clickMenuSetting"]);

const clickIcon = () => {
  emit("clickMenuSetting");
};

let userinfoStr = JSON.parse(sessionStorage.getItem(USEER_INFO_KEY) ?? "{}");

/**
 * 清除缓存，退出登陆
 */
const logoutHandler = () => {
  sessionStorage.removeItem(USEER_INFO_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  router.replace({ path: "/login" });
};
</script>

<style lang="less" scoped>
.navbar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100px;
  background-color: #fafafa;
  border-bottom: 2px solid #ececec;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  .left {
    display: flex;
    align-items: center;
    text-align: left;
    letter-spacing: 1px;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    letter-spacing: 1px;

    .userInfo {
      width: 100px;
      height: fit-content;
      margin-left: 80px;
    }
  }
}
</style>
