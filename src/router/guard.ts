// router/guard.ts

import { useUserStore } from '@/store'

export const setupRouterGuard = (router: any) => {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 跳过公共路由
    if (to.meta.public) {
      next()
      return
    }

    // 检查认证
    if (!userStore.userInfo.account && !to.path.startsWith('/login')) {
      next('/login')
      return
    }

    // 角色验证
    if (to.meta.role && to.meta.role !== userStore.userInfo.role) {
      next(userStore.userInfo.role === 'admin' ? '/admin' : '/student')
      return
    }

    // 默认跳转
    if (to.path === '/') {
      next('/login')
      return
    }

    next()
  })
}
