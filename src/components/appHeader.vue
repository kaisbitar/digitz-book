<template>
  <v-app-bar class="position-fixed app-top-bar" :elevation="0" border="b">
    <template v-slot:prepend>
      <v-toolbar-title class="hidden-sm-and-down mx-3"
        >الكتاب المرقوم</v-toolbar-title
      >
      <AppNavigation
        :activeRoute="activeRoute"
        @navigateTo="handleNavigation"
      />
      <AutoCompleteDialog />
    </template>
    <template v-slot:append>
      <v-icon @click="handleNavigation('/')" class="mx-2"
        >mdi-home-variant-outline
      </v-icon>
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

const handleNavigation = (route) => {
  if (route === "search") {
    router.push(route)
    return
  }
  router.push(route)
}

watch(researchResults.value, (newValue) => {})
</script>

<style scoped></style>
