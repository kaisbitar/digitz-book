<template>
  <v-app-bar
    :elevation="0"
    density="comfortable"
    class="border-b"
    location="top"
  >
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      class="ml-2"
      v-if="isMobile && !isInputVisible"
    />
    <v-app-bar-title class="mr-16" style="max-width: 140px" v-if="!isMobile">
      رُسُلْ
    </v-app-bar-title>
    <v-container v-if="isInputVisible" class="pt-6" max-width="75vw">
      <div class="mb-2">
        <SearchBar :autoFocus="isMobile" />
      </div>
    </v-container>
    <AppToggleBtn
      v-if="!isInputVisible"
      :isActive="false"
      btnText="ترتيل القرآن"
      inActiveIcon="mdi-magnify"
      activeIcon="mdi-close"
      size="default"
      @toggle="isInputVisible = true"
    />

    <v-spacer></v-spacer>
    <AppToggleBtn
      v-if="!(isMobile && isInputVisible)"
      class="mx-2 mx-sm-4"
      btnText="السور"
      :btnVariant="getButtonVariant('index')"
      :isActive="indexDrawerState"
      inActiveIcon="mdi-book-open-outline"
      activeIcon="mdi-book-open"
      size="default"
      @toggle="toggleDrawer('index')"
    />
    <UserAvatar />
  </v-app-bar>
  <v-divider></v-divider>

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
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useStore } from "@/stores/appStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import UserAvatar from "@/components/Profile/UserAvatar.vue"
import SearchBar from "@/components/SearchBar.vue"

const tarteelStore = useTarteelStore()
const router = useRouter()
const display = useDisplay()
const activeRoute = computed(() => router.currentRoute.value.name)

const isInputVisible = ref(false)
const drawer = ref(false)

// On mobile the search box is hidden until asked for
watch(
  () => tarteelStore.searchFocusTick,
  () => {
    isInputVisible.value = true
  },
)

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
onMounted(() => {
  if (!isMobile.value) {
    isInputVisible.value = true
  }
  if (router.currentRoute.value.name === "home") {
    isInputVisible.value = false
  }
  if (router.currentRoute.value.query.focus) {
    isInputVisible.value = true
  }
})
</script>
