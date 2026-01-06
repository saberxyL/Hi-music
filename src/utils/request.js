import axios from 'axios'
import config from '@/config' // 引入统一配置
import { useUserStore } from '@/stores/user.js'

// 创建 axios 实例
const request = axios.create({
  baseURL: config.baseUrl, // 使用 config 中的值
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // 在发送请求之前做些什么
    const token = userStore.token
    if (token) {
      // 让每个请求携带自定义 token 请根据实际情况自行修改
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 直接返回数据，不做状态码判断
    return res
  },
  error => {
    console.error('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default request
