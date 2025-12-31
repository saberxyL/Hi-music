import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

// 使用路由和状态管理
app.use(router)
app.use(pinia)
app.mount('#app')

// elementPlus国际化配置
app.use(ElementPlus, {
  locale: zhCn
})
// main.ts

// 全局注册elementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
console.log('test git push')
console.log('test git pull')
