import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import pinia from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/styles/resize.scss'

const app = createApp(App)

// 使用路由和状态管理
app.use(router)
app.use(pinia)

// elementPlus国际化配置
app.use(ElementPlus, {
  locale: zhCn
})

// 全局注册elementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
