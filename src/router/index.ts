import DataManagement from '@/views/Layout/DataManagement.vue'
import Home from '@/views/Layout/Home.vue'

import LayoutPage from '@/views/Layout/LayoutPage.vue'
import UserCenter from '@/views/Layout/UserCenter.vue'
import LoginPage from '@/views/Login/LoginPage.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LayoutPage,
      children: [
        {
          path: '',
          component: Home,
        },
        {
          path: 'data',
          component: DataManagement,
        },
        {
          path: 'user',
          component: UserCenter,
        },
      ],
    },
    {
      path: '/login',
      component: LoginPage,
    },
  ],
})

export default router
