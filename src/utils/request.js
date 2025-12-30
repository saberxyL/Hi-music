import axios from 'axios'
import config from '@/config' // 引入统一配置

// 创建 axios 实例

const request = axios.create({
  baseURL: config.baseUrl, // 使用 config 中的值
  timeout: config.timeout
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
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
