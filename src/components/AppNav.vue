<template>
  <v-app-bar :elevation="0" density="compact" class="border-b" location="top">
    <v-app-bar-nav-icon
      @click="toggleRailAppNavDrawer"
      class="ml-2"
      v-if="!(isMobile && isInputVisible)"
    />

    <div class="w-100 d-flex">
      <v-app-bar-title v-if="!isInputVisible" class="pt-1">
        الكتاب المرقوم
      </v-app-bar-title>
      <AutoBoard
        v-if="isInputVisible"
        class="flex-grow-1 mt-1"
        :class="{ 'px-1': isMobile }"
        :style="{ maxWidth: '850px' }"
        @update:isInputVisible="isInputVisible = $event"
      />
    </div>
    <v-spacer v-if="!isMobile"></v-spacer>
    <AppToggleBtn
      v-if="!(isMobile && isInputVisible)"
      :isActive="isInputVisible"
      btnText="ترتيل القرآن"
      inActiveIcon="mdi-magnify"
      activeIcon="mdi-close"
      size="default"
      @toggle="isInputVisible = !isInputVisible"
    />
    <AppToggleBtn
      v-if="!(isMobile && isInputVisible)"
      class="mx-2 mx-sm-4 tarteel-btn"
      :badgeContent="tarteelBadgeContent"
      btnText="تراتيل"
      :btnVariant="getButtonVariant('tarteel')"
      :isActive="openDrawers.tarteel"
      inActiveIcon="mdi-database-search-outline"
      activeIcon="mdi-database-search"
      size="default"
      @toggle="toggleDrawer('tarteel')"
    />
    <AppToggleBtn
      v-if="!(isMobile && isInputVisible)"
      class="mx-2 mx-sm-4"
      btnText="السور"
      :btnVariant="getButtonVariant('index')"
      :isActive="openDrawers.index"
      inActiveIcon="mdi-book-open-outline"
      activeIcon="mdi-book-open"
      size="default"
      @toggle="toggleDrawer('index')"
    />
  </v-app-bar>
  <v-divider></v-divider>

  <TableQuranIndex v-model:drawer="indexDrawer" />

  <AppNavDrawer
    v-model="drawer"
    :rail="isRail && !isMobile"
    :location="isMobile ? 'left' : 'right'"
    :temporary="isMobile"
    :permanent="!isMobile"
    :navigationItems="navigationItems"
    :activeRoute="activeRoute"
    :expand-on-hover="!isMobile"
    @navigateTo="handleNavigation"
    @update:modelValue="updateDrawer"
  />
  <TarteelDrawer v-model:drawer="tarteelDrawer" />
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useTarteelStore } from "@/stores/tarteelStore"

const tarteelStore = useTarteelStore()
const router = useRouter()
const display = useDisplay()
const activeRoute = computed(() => router.currentRoute.value.name)

const isInputVisible = ref(false)
const isRail = ref(true)
const drawer = ref(true)
const tarteelDrawer = ref(false)
const indexDrawer = ref(false)
const tarteelBadgeContent = computed(() => {
  return String(
    tarteelStore.storedTarteels.length ? tarteelStore.storedTarteels.length : ""
  )
})

const handleNavigation = (route) => {
  router.push(route)
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
    route: "/",
    icon: "mdi-account-outline",
    activeIcon: "mdi-account",
    label: "تفسيري",
  },
]

const openDrawers = ref({
  index: false,
  tarteel: false,
})

const getButtonVariant = (drawerName) => {
  return openDrawers.value[drawerName] ? "tonal" : "text"
}

const toggleDrawer = (drawerName) => {
  openDrawers.value[drawerName] = !openDrawers.value[drawerName]
  if (drawerName === "index") {
    indexDrawer.value = openDrawers.value.index
    return
  }
  tarteelDrawer.value = openDrawers.value.tarteel
}

watch(indexDrawer, (newValue) => {
  openDrawers.value.index = newValue
})

watch(tarteelDrawer, (newValue) => {
  openDrawers.value.tarteel = newValue
})

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
</script>

<style>
.tarteel-btn .v-badge__badge {
  z-index: 2;
}
</style>
