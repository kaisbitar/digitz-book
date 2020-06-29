import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/single-sura',
    name: 'single',
    component: () => import('../views/singleSura.vue')
  },
  {
    path: '/group-of-suras',
    name: 'group',
    component: () =>
      import('../views/surasGroup.vue')
  },
  {
    path: '/full-book',
    name: 'full',
    component: () =>
      import('../views/fullBook.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () =>
      import('../views/search.vue')
  },
  {
    path: '*',
    component: () =>
      import('../pageNotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
