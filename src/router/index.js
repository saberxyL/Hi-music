import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '@/config/menu'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    ...allRoutes
  ],
  linkExactActiveClass: 'exact-active',
  linkActiveClass: 'active'
})
