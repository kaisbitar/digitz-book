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
    path: "/single-sura",
    name: "Single Sura",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/singleSura.vue")
  },
  {
    path: "/group-of-suras",
    name: "Group of Suras",

    component: () =>
      import("../views/surasGroup.vue")
  },
  {
    path: "/full-book",
    name: "Full Book",

    component: () =>
      import("../views/fullBook.vue")
  },
  {
    path: "/search",
    name: "Search",

    component: () =>
      import("../views/search.vue")
  },
  { 
    path: "*", 
    component: () =>
    import("../pageNotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
