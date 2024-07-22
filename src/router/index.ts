import { createRouter, createWebHistory } from 'vue-router'
import LogtoClient from '@logto/browser'
import CONFIG from '@/config'
import { useLogto } from '@logto/vue'
const { getAccessToken } = useLogto()

const logtoCli = new LogtoClient({
  endpoint: CONFIG.LOGTO.ENDPOINT,
  appId: CONFIG.LOGTO.APPID,
  resources: CONFIG.LOGTO.RESOURCES
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/Landing.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/Search.vue')
    },
    {
      path: '/chat/:hid',
      name: 'Chat',
      component: () => import('@/views/Chat.vue')
    },
    {
      path: '/chat/new/:cid',
      name: 'NewChat',
      component: () => import('@/views/Chat.vue')
    },
    {
      path: '/user/:uid',
      name: 'User',
      component: () => import('@/views/User.vue')
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallback.vue')
    },
    {
      path: '/auth/login',
      name: 'RequireLogin',
      component: () => import('@/views/RequireLogin.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ],
  linkActiveClass: 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white'
})

router.beforeEach(async (to, from) => {
  let needAuth = false

  const authed = await logtoCli.isAuthenticated()
  if (to.name !== 'RequireLogin' && to.name !== 'AuthCallback') {
    // not going to login page
    if (authed) {
      // already authenticated
      if (getAccessToken(CONFIG.API.ENDPOINT) === undefined) {
        // token expired
        needAuth = true
      }
    } else {
      // not authenticated
      needAuth = true
    }
  }

  if (needAuth) {
    const query: Record<string, string> = {}
    if (to.name !== 'Landing') {
      query['return'] = encodeURIComponent(to.fullPath)
    }
    return { name: 'RequireLogin', query }
  }
})

export default router
