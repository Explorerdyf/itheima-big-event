import axios from 'axios'
import { useUserStore } from '@/stores'
// js里需要导入
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    // 如果有token 就在响应头加上Authorization
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 响应成功
    if (res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败
    ElMessage({
      showClose: true,
      message: res.data.message || '服务异常',
      type: 'error'
    })
    // TODO 4. 摘取核心响应数据
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 =>401 权限不足 或 token 过期 =>拦截到登录页面
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 错误的默认情况 => 只要给提示
    ElMessage({
      showClose: true,
      message: err.response.data.message || '服务异常',
      type: 'error'
    })
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
