<template>
  <v-app-bar
    class="position-fixed app-top-bar"
    density="compact"
    :elevation="0"
    border="b"
  >
    <template v-slot:prepend>
      <v-toolbar-title class="hidden-sm-and-down"
        >الكتاب المرقوم</v-toolbar-title
      >
      <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
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
      <AppSettings :components="[ThemeToggle, AppZoom]"> </AppSettings>
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
  /* margin-top: -7px;  */
}
.app-top-bar {
  /* background: rgb(var(--v-theme-second-background)) !important; */
  /* border-bottom: 0.1px solid #9e9e9e62; */
}
</style>
