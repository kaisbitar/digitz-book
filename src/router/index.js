/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto"
import { setupLayouts } from "virtual:generated-layouts"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home"),
  },
  ,
  {
    path: "/sura",
    name: "sura",
    component: () => import("@/pages/Sura"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/pages/Search"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error")
      localStorage.setItem("vuetify:dynamic-reload", "true")
      location.assign(to.fullPath)
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload")
})

export default router
