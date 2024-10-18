<template>
  <div>
    <v-app-bar
      :elevation="0"
      :density="isInputVisible ? 'default' : 'compact'"
      class="border-b"
    >
      <v-app-bar-nav-icon
        v-if="!isInputVisible"
        @click="toggleRailAppNavDrawer"
      />
      <v-app-bar-title v-if="!isInputVisible">الكتاب المرقوم</v-app-bar-title>

      <v-spacer v-if="!isMobile"></v-spacer>

      <AppToggleBtn
        class="mx-0 msx-sm-2"
        :isActive="isInputVisible"
        btnText="ابحث في المصحف"
        inactive-icon="mdi-magnify"
        size="default"
        @toggle="isInputVisible = !isInputVisible"
      />

      <AutoComplete
        class="ml-4"
        v-if="isInputVisible"
        v-click-outside="onInputClickOutside"
        :style="{ maxWidth: '500px' }"
      />

      <v-spacer v-if="!isMobile"></v-spacer>

      <AppToggleBtn
        class="mx-0 msx-sm-2"
        v-if="!isInputVisible"
        :isActive="isInputVisible"
        btnText="السور"
        :btnVariant="indexbtnVariant"
        inactive-icon="mdi-menu-open"
        size="default"
        @toggle="toggleIndexDrawer"
      />
    </v-app-bar>
    <v-divider></v-divider>

    <TableQuranIndex />

    <AppNavigationItems
      v-model="drawer"
      :rail="isRail && !isMobile"
      :temporary="isMobile"
      :permanent="!isMobile"
      :navigationItems="navigationItems"
      :activeRoute="activeRoute"
      @navigateTo="handleNavigation"
    />
    <!-- THis is a work around for a bug on phones only when location is set to right
        :location="isMobile && !drawer ? 'left' : 'right'"  -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useQuranStore } from "@/stores/app"

const router = useRouter()
const display = useDisplay()
const store = useQuranStore()
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

const indexbtnVariant = computed(() => {
  return store.getIndexIsOpen ? "tonal" : "text"
})

const isMobile = computed(() => {
  return display.mobile.value
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

const toggleIndexDrawer = () => {
  store.setIndexIsOpen(!store.getIndexIsOpen)
}

const onInputClickOutside = () => {
  isInputVisible.value = false
}
</script>

<style scoped></style>
