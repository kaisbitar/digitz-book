import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/sura",
    name: "Sura",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/singleSura.vue")
  },
  {
    path: "/allSuras",
    name: "All Suras",
    component: () =>
      import("../views/allSuras.vue")
  },
  {
    path: "/quran",
    name: "Quran",
    component: () =>
      import("../views/quran.vue")
  },
  {
    path: "/search",
    name: "Search",
    component: () =>
      import("../views/singleSura.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
