import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes, PageEnum } from '@/config/menu'

// 筛选出不需要 Layout 的独立路由 (Standalone, Fullscreen)
const rootRoutes = allRoutes.filter(route =>
  [PageEnum.STANDALONE, PageEnum.FULLSCREEN].includes(route.meta?.pageType)
)

// 筛选出需要 Layout 的路由 (Embedded, Tab)
const layoutChildrenRoutes = allRoutes.filter(route =>
  [PageEnum.EMBEDDED, PageEnum.TAB].includes(route.meta?.pageType)
)

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: layoutChildrenRoutes
    },
    ...rootRoutes
  ],
  linkExactActiveClass: 'exact-active',
  linkActiveClass: 'active'
})
