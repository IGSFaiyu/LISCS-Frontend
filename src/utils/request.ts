import axios from 'axios'
import { TOKEN_KEY, TOKEN_PREFIX } from "@/enums/CacheEnum";
import router from "@/router";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_API_URL + import.meta.env.VITE_APP_BASE_API,
})
setupRequestInterceptors(service);
export default service

// 设置拦截器
export function setupRequestInterceptors(service) {
  // request拦截器
  service.interceptors.request.use(
    config => {
      // config.data = JSON.stringify(config.data)
      if (sessionStorage.getItem(TOKEN_KEY)) {
        config.headers.Authorization = TOKEN_PREFIX + sessionStorage.getItem(TOKEN_KEY)
      }
      return config
    },
    error => {
      console.log(error)
      Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(res => {
    const status = res.data.data?.code || res.status
    // const errorCode = res.data.errorCode
    if (status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      ElMessage.warning('登录状态已过期，您可以继续留在该页面，或者重新登录')
      router.push('/login')
    } else {
      return res.data;
    }
  },
    error => {
      if (error.response.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        console.error("The session has expired. You should log in again")
        router.push('/login')
        ElMessage.warning('登录状态过期，请重新登录')
      } else {
        ElMessage.error('系统错误')
      }
      console.log('err: ', error)
      return Promise.reject(error)
    }
  )
}
