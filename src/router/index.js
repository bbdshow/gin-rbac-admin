import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import $store from '@/store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/appset',
        name: 'appset',
        component: () => import('@views/Appset')
      },
      {
        path: '/menuset',
        name: 'menuset',
        component: () => import('@views/menuSet/MenuSet')
      },
      {
        path: '/actionset',
        name: 'actionset',
        component: () => import('@views/ActionSet')
      },
      {
        path: '/roleset',
        name: 'roleset',
        component: () => import('@views/roleset/RoleSet')
      },
      {
        path: '/accountset',
        name: 'accountset',
        component: () => import('@views/account/AccountSet')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = $store.state.token
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
