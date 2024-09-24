<template>
  <div class="login-container">
    <!-- 登录表单 -->
    <el-card style="border-radius: 20px; width: 400px">
      <div style="text-align: center">
        <h2>{{ defaultSettings.title }}</h2>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginData.username"
            placeholder="username"
            name="username"
            size="large"
          />
        </el-form-item>

        <!-- 密码 -->
        <el-tooltip :visible="isCapslock" placement="right">
          <el-form-item prop="password">
            <el-input
              v-model="loginData.password"
              placeholder="password"
              type="password"
              name="password"
              @keyup="checkCapslock"
              @keyup.enter="handleLogin"
              size="large"
              show-password
            />
          </el-form-item>
        </el-tooltip>

        <!-- 登录按钮 -->
        <div style="text-align: center; width: 100%; margin-top: 50px">
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
            >Login</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import router from "@/router";
import defaultSettings from "@/settings";
import { TOKEN_KEY, USEER_INFO_KEY } from "@/enums/CacheEnum";
import { loginApi, testloginApi } from "@/api/auth/index";
import { ElMessage } from "element-plus";

const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const loginFormRef = ref(); // 登录表单ref

const loginData = ref({
  username: "admin",
  password: "123456",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: "required",
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "wesfrwesf",
      },
      {
        min: 6,
        message: "lll",
        trigger: "blur",
      },
    ],
  };
});

/** 登录 */
const route = useRoute();
function handleLogin() {
  loading.value = true;
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const query: LocationQuery = route.query;
      const redirect = (query.redirect as LocationQueryValue) ?? "/";
      const otherQueryParams = Object.keys(query).reduce((acc: any, cur: string) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
      loginApi({ ...loginData.value })
        .then((result) => {
          let code = result.code,
            data = result.data,
            message = result.message;
          if (code === 200) {
            sessionStorage.setItem(TOKEN_KEY, data.Token);
            sessionStorage.setItem(USEER_INFO_KEY, JSON.stringify(data));
            router.push({ path: "/", query: otherQueryParams });
            console.log("Login Success");
            ElMessage.success(message);
          } else {
            ElMessage.error(message);
            console.log("Error fetching data:", message);
          }
        })
        .catch((err) => {
          loading.value = false;
          ElMessage.error(err);
          console.log("Error fetching data:", err);
        });
      // try {
      //   let result = loginApi(loginData.value);
      //   let code = result.code,
      //     data = result.data,
      //     message = result.message;
      //   if (code === 200) {
      //     sessionStorage.setItem(TOKEN_KEY, data.Token);
      //     sessionStorage.setItem(USEER_INFO_KEY, JSON.stringify(data));
      //     router.push({ path: "/", query: otherQueryParams });
      //     console.log("Login Success");
      //     ElMessage.success(message);
      //   } else {
      //     ElMessage.error(message);
      //     console.log("Error fetching data:", message);
      //   }
      // } catch (err) {
      //   loading.value = false;
      //   ElMessage.error(err);
      //   console.log("Error fetching data:", err);
      // }
    }
  });
}

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}
</script>

<style lang="scss" scoped>
html.dark .login-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;
  height: 100%;
  position: relative;

  @apply wh-full flex-center;

  .login-form {
    padding: 30px 10px;
  }
  :deep(.el-card) {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
  :deep(.el-input__inner) {
    padding-left: 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}
</style>
