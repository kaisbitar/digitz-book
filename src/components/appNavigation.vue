<template>
  <v-app-bar elevation="0" density="compact" class="border-b">
    <v-app-bar-nav-icon v-if="!isInputVisible" @click="toggleRail" />
    <v-app-bar-title v-if="!isMobile && !isInputVisible"
      >الكتاب المرقوم</v-app-bar-title
    >
    <v-spacer v-if="!isMobile"></v-spacer>

    <AutoComplete v-if="isInputVisible" class="mr-2" />
    <AppToggleBtn
      :isVisible="isInputVisible"
      :button-text="`ابحث في المصحف..`"
      @toggle="isInputVisible = !isInputVisible"
    />
    <v-spacer v-if="!isMobile"></v-spacer>
  </v-app-bar>
  <v-divider></v-divider>

  <TableQuranIndex />

  <v-navigation-drawer
    v-model="drawer"
    :rail="isRail && !isMobile"
    location="right"
    :temporary="isMobile"
    :permanent="!isMobile"
  >
    <appNavigationItems
      :navigationItems="navigationItems"
      :activeRoute="activeRoute"
      @navigateTo="handleNavigation"
    />
  </v-navigation-drawer>
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

const isInputVisible = ref(false)
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

const toggleDrawer = () => {
  drawer.value = !drawer.value
  if (!isMobile.value && drawer.value) {
    isRail.value = false
  }
}

const toggleRail = () => {
  toggleDrawer()
  if (!isMobile.value) {
    isRail.value = !isRail.value
    drawer.value = true
  }
}
</script>

<style scoped></style>
