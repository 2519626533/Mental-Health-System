import DataManagement from '@/views/Layout/DataManagement.vue'
import Home from '@/views/Layout/Home.vue'

import LayoutPage from '@/views/Layout/LayoutPage.vue'
import Scl90Page from '@/views/Layout/Scl90Page.vue'
import StudentHome from '@/views/Layout/StudentHome.vue'
import UserCenter from '@/views/Layout/UserCenter.vue'
import LoginPage from '@/views/Login/LoginPage.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 管理员
    {
      path: '/admin',
      component: LayoutPage,
      meta: {
        requiresAuth: true,
        role: 'admin',
      },
      children: [
        {
          path: '',
          component: Home,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'data',
          component: DataManagement,
          meta: { requiresAuth: true, role: 'admin' },
        },
        {
          path: 'user',
          component: UserCenter,
          meta: { requiresAuth: true, role: 'admin' },
        },
      ],
    },
    // 普通用户
    {
      path: '/student',
      component: LayoutPage,
      meta: {
        requiresAuth: true,
        role: 'student',
      },
      children: [
        {
          path: '',
          component: StudentHome,
          meta: {
            requiresAuth: true,
            role: 'student',
          },
        },
        {
          path: 'test',
          component: Scl90Page,
          meta: {
            requiresAuth: true,
            role: 'student',
          },
        },
        {
          path: 'user',
          component: UserCenter,
          meta: {
            requiresAuth: true,
            role: 'student',
          },
        },
      ],
    },
    {
      path: '/login',
      component: LoginPage,
      meta: {
        public: true,
      },
    },
    // 404路由
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/views/error/NotFound.vue'),
    // },
  ],
})

export default router
