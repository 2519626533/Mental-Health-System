import Home from '@/views/Layout/Home.vue'

import LayoutPage from '@/views/Layout/LayoutPage.vue'
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
      ],
    },
    {
      path: '/login',
      component: LoginPage,
    },
  ],
})

export default router
