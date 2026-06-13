import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/AdminPanel.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
