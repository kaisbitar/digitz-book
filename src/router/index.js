/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto"
import { setupLayouts } from "virtual:generated-layouts"
import { useAuthStore } from "@/stores/authStore"
import { processSuraNavigation } from "./utils"
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home"),
  },
  ,
  {
    path: "/sura/:suraNumber?/:verseIndex?",
    name: "sura",
    component: () => import("@/pages/Sura"),
    beforeEnter: async (to, from, next) => {
      if (!to.params.suraNumber) {
        next()
        return
      }
      await processSuraNavigation(to)
      next()
    },
  },
  {
    path: "/tarteel",
    name: "tarteel",
    component: () => import("@/pages/Tarteel"),
  },
  {
    path: "/tafsiri",
    name: "tafsiri",
    component: () => import("@/pages/Tafsiri"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/Auth/LoginForm.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/components/Auth/RegisterForm.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/components/Profile/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: () => import("@/views/AuthCallback.vue"),
    beforeEnter: async (to, from, next) => {
      const authStore = useAuthStore()
      try {
        await authStore.handleAuthCallback()
        next("/tafsiri")
      } catch (error) {
        console.error("Auth callback error:", error)
        next("/login")
      }
    },
  },
  {
    path: "/duality",
    name: "duality-test",
    component: () => import("@/components/Tarkeem/Tarkeem.vue"),
  },
  {
    path: "/tarteel",
    children: [
      {
        path: "",
        name: "tarteel-overview",
        component: () => import("@/pages/Tarteel.vue"),
      },
      {
        path: "detail",
        name: "tarteel-detail",
        component: () => import("@/pages/Tarteel.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } })
  } else {
    next()
  }
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
