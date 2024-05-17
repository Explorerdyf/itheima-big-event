import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})
// 登录访问拦截
// 需要权限的路由
// const authUrls = ['/login', '/myorder'] authUrls.includes(to.path)
router.beforeEach((to) => {
  const userStore = useUserStore()
  const token = userStore.token
  // 如果没有 token 且 要跳转路径为非登录路径，则都是需要授权的路径
  if (!token && to.path !== '/login') {
    // 通过return 跳转，相当于 vue2 中的 next
    return '/login'
  }
})
export default router
