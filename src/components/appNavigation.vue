<template>
  <v-navigation-drawer
    v-if="!isMobile"
    class="app-navigation-drawer"
    v-model="drawer"
    permanent
    :rail="isRail"
    location="left"
    expand-on-hover
  >
    <appNavigationItems
      :navigationItems="navigationItems"
      :activeRoute="activeRoute"
      @navigateTo="handleNavigation"
      @toggleRail="isRail = !isRail"
    />
  </v-navigation-drawer>

  <v-bottom-navigation v-if="isMobile" grow color="primary" app fixed>
    <AppSettings :components="[ThemeToggle, AppZoom]" />
    <v-btn
      v-for="item in navigationItems"
      :key="item.route"
      @click="handleNavigation(item.route)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.label }}</span>
    </v-btn>
    <!-- <v-divider></v-divider> -->
  </v-bottom-navigation>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import ThemeToggle from "./themeToggle.vue"
import AppZoom from "./AppZoom.vue"
import { useDisplay } from "vuetify"

const router = useRouter()
const display = useDisplay()

const activeRoute = computed(() => router.currentRoute.value.name)

const isRail = ref(true)
const drawer = ref(true)
const handleNavigation = (route) => {
  router.push(route)
}
const navigationItems = [
  {
    route: "/",
    icon: "mdi-home-variant-outline",
    activeIcon: "mdi-home-variant",
    label: "Home",
  },
  {
    route: "sura",
    icon: "mdi-book-open-outline",
    activeIcon: "mdi-book-open",
    label: "السور",
  },
  {
    route: "search",
    icon: "mdi-database-search-outline",
    activeIcon: "mdi-database-search",
    label: "ترتيل",
  },
  {
    route: "/",
    icon: "mdi-account-outline",
    activeIcon: "mdi-account",
    label: "تفسيري",
  },
]

const isMobile = computed(() => {
  return display.mobile.value
})
</script>

<style scoped></style>
