<template>
  <v-navigation-drawer
    class="app-navigation-drawer"
    :elevation="0"
    v-model="drawer"
    permanent
    :rail="isRail"
    location="left"
    expand-on-hover
  >
    <AppNavigation
      :activeRoute="activeRoute"
      @navigateTo="handleNavigation"
      @toggleRail="isRail = !isRail"
    />
  </v-navigation-drawer>

  <v-bottom-navigation grow color="primary">
    <v-btn
      v-for="item in navigationItems"
      :key="item.route"
      @click="handleNavigation(item.route)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)

const isRail = ref(true)
const drawer = ref(true)
const handleNavigation = (route) => {
  router.push(route)
}
const navigationItems = [
  { route: "/", icon: "mdi-home-variant-outline", label: "Home" },
  { route: "sura", icon: "mdi-book-open-outline", label: "Sura" },
  { route: "search", icon: "mdi-database-search-outline", label: "Search" },
  { route: "settings", icon: "mdi-cog-outline", label: "Settings" },
]
</script>

<style scoped></style>
