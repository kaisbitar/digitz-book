<template>
  <v-app-bar
    :elevation="0"
    density="comfortable"
    class="border-b"
    location="top"
  >
    <v-app-bar-nav-icon
      @click="toggleRailAppNavDrawer"
      class="ml-2"
      v-if="!(isMobile && isInputVisible)"
    />
    <v-app-bar-title class="mr-0" style="max-width: 140px" v-if="!isMobile">
      رُسُلْ
    </v-app-bar-title>
    <v-container v-if="isInputVisible" class="pt-6" max-width="900">
      <div class="mb-2">
        <AutoBoard
          v-if="isInputVisible"
          context="nav"
          :openOnMount="isMobile"
          @update:isInputVisible="isInputVisible = $event"
          @submitTarteel="isMobile ? (isInputVisible = false) : null"
          @close="isMobile ? (isInputVisible = false) : null"
        />
      </div>
    </v-container>
    <AppToggleBtn
      v-if="!isInputVisible"
      :isActive="isInputVisible"
      btnText="ترتيل القرآن"
      inActiveIcon="mdi-magnify"
      activeIcon="mdi-close"
      size="default"
      @toggle="isInputVisible = !isInputVisible"
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
    :rail="isRail && !isMobile"
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
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useStore } from "@/stores/appStore"
import UserAvatar from "@/components/Profile/UserAvatar.vue"

const router = useRouter()
const display = useDisplay()
const activeRoute = computed(() => router.currentRoute.value.name)

const isInputVisible = ref(false)
const isRail = ref(false)
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

const toggleAppNavDrawer = () => {
  drawer.value = !drawer.value
  if (!isMobile.value && drawer.value) {
    isRail.value = false
  }
}

const toggleRailAppNavDrawer = () => {
  toggleAppNavDrawer()
  if (!isMobile.value) {
    isRail.value = !isRail.value
    drawer.value = true
  }
}

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
})
</script>