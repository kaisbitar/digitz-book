<template>
  <v-app-bar :elevation="0" density="comfortable" location="top">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="ml-2" />
    <v-app-bar-title class="mr-16" style="max-width: 140px" v-if="!isMobile">
      رُسُلْ
    </v-app-bar-title>
    <v-container class="pt-6 flex-grow-1" style="max-width: 480px" fluid>
      <div class="mb-2">
        <SearchBar :autoFocus="isMobile" />
      </div>
    </v-container>

    <v-spacer></v-spacer>
    <AppToggleBtn
      class="mx-2 mx-sm-4"
      btnText="السور"
      :btnVariant="getButtonVariant('index')"
      :isActive="indexDrawerState"
      inActiveIcon="mdi-book-open-outline"
      activeIcon="mdi-book-open"
      size="default"
      @toggle="toggleDrawer('index')"
    />
    <!-- <UserAvatar /> -->
  </v-app-bar>

  <TableQuranIndex />

  <AppNavDrawer
    v-model="drawer"
    :rail="!isMobile"
    :permanent="!isMobile"
    :location="'right'"
    :temporary="isMobile"
    :navigationItems="navigationItems"
    :activeRoute="activeRoute"
    :expand-on-hover="!isMobile"
    @navigateTo="handleNavigation"
    @update:modelValue="updateDrawer"
  />
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useStore } from "@/stores/appStore"
import SearchBar from "@/components/SearchBar.vue"

const router = useRouter()
const display = useDisplay()
const activeRoute = computed(() => router.currentRoute.value.name)

const drawer = ref(false)

const handleNavigation = (route) => {
  router.push(route)
}

const openDrawers = ref({
  index: false,
})

const getButtonVariant = (drawerName) => {
  return openDrawers.value[drawerName] ? "tonal" : "text"
}

const store = useStore()

const indexDrawerState = computed(() => store.getIndexDrawer)

const toggleDrawer = (drawerName) => {
  if (drawerName === "index") {
    openDrawers.value.index = !indexDrawerState.value
    console.log(indexDrawerState.value)
    store.setIndexDrawer(!indexDrawerState.value)
    return
  }
}

const isMobile = computed(() => {
  return display.smAndDown.value
})

// Desktop: always open as a slim rail that expands on hover.
// Mobile: hidden until the hamburger opens it.
watch(isMobile, (mobile) => (drawer.value = !mobile), { immediate: true })

const updateDrawer = (value) => {
  drawer.value = value
}

const navigationItems = [
  {
    route: "/",
    icon: "mdi-home-variant-outline",
    activeIcon: "mdi-home-variant",
    label: "المنزل",
  },
  {
    route: "sura",
    icon: "mdi-book-open-outline",
    activeIcon: "mdi-book-open",
    label: "السور",
  },
  {
    route: "tarteel",
    icon: "mdi-database-search-outline",
    activeIcon: "mdi-database-search",
    label: "ترتيل",
  },
  {
    route: "/tafsiri",
    icon: "mdi-account-outline",
    activeIcon: "mdi-account",
    label: "تدبري",
  },
]
</script>
