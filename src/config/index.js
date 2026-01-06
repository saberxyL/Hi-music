// 统一管理配置，业务代码只需要引入 config 即可，不需要关心变量名是 VITE_ 还是 VUE_APP_
export default {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 5000,
  title: import.meta.env.VITE_APP_TITLE,
  // tokenKey
  tokenKey: import.meta.env.VITE_TOKEN || 'token'
  // 这里还可以写一些非环境变量的静态配置
}
