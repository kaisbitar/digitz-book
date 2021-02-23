import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'singleSura',
    component: () => import('../views/singleSura.vue')
  },
  {
    path: '/group-of-suras',
    name: 'surasGroup',
    component: () =>
      import('../views/surasGroup.vue')
  },
  {
    path: '/search',
    name: 'search',
    meta: { keepAlive: true },
    component: () =>
      import('../views/search.vue')
  },
  {
    path: '*',
    component: () =>
      import('../pageNotFound.vue')
  },
  {
    path: '/test',
    component: () =>
      import('../test.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
