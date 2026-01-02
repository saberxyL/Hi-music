import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '@/config/menu'

// 筛选出不需要 Layout 的路由 (如登录页)
const noLayoutRoutes = allRoutes.filter(route =>
  ['/login'].includes(route.path)
)

// 筛选出需要 Layout 的路由
const layoutChildrenRoutes = allRoutes.filter(
  route => !['/login'].includes(route.path)
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
    ...noLayoutRoutes
  ],
  linkExactActiveClass: 'exact-active',
  linkActiveClass: 'active'
})
