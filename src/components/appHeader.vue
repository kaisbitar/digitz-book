<template>
  <v-app-bar class="" height="40" border flat>
    <template v-slot:prepend>
      <v-toolbar-title>الكتاب المرقوم</v-toolbar-title>
      <v-app-bar-nav-icon
        size="small"
        @click.stop="toggleDrawer"
      ></v-app-bar-nav-icon>
      <AppNavigation
        :activeRoute="activeRoute"
        @navigateTo="handleNavigation"
      />
      <AutoCompleteDialog
        v-model="showAutoComplete"
        @update:modelValue="closeSearchDialog"
      />
    </template>
    <template v-slot:append>
      <v-icon size="small" @click="handleNavigation('/')">mdi-home</v-icon>
      <AppDropMenu :components="[ThemeToggle, AppZoom]"> </AppDropMenu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import ThemeToggle from "./themeToggle.vue"
import AppZoom from "./AppZoom.vue"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()

const activeRoute = computed(() => router.currentRoute.value.name)
const researchResults = computed(() => store.getResearchResults)
const showAutoComplete = ref(false)

const openSearchDialog = () => {
  showAutoComplete.value = true
  router.push("/search")
}

const closeSearchDialog = () => {
  showAutoComplete.value = false
}

const handleNavigation = (route) => {
  if (route === "search") {
    showAutoComplete.value = true
    router.push("/search")
    return
  }
  showAutoComplete.value = false
  router.push(route)
}

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState)
}

watch(researchResults.value, (newValue) => {
  showAutoComplete.value = false
})
</script>

<style scoped>
.v-toolbar-title {
  width: 163px;
  margin-top: -7px;
}
</style>
