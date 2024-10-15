<template>
  <v-app v-if="isReady">
    <v-main>
      <AppHeader v-if="activeRoute !== 'home'" />
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"

const store = useQuranStore()
const router = useRouter()
const isReady = ref(false)

const activeRoute = computed(() => router.currentRoute.value.name)

const drawer = computed({
  get: () => store.getDrawerState,
  set: (value) => store.setDrawerState(value),
})

const handleLanding = () => {
  if (activeRoute.value === "sura") {
    drawer.value = true
  } else if (activeRoute.value === "search") {
    drawer.value = false
  }
}

watch(activeRoute, handleLanding)

onMounted(() => {
  // Wait for stylesheets to load before rendering the app
  window.addEventListener("load", () => {
    isReady.value = true
  })
})
</script>

<style lang="scss">
// @import "@/styles/variables.scss";
// .main-wrapp {
//   // padding-top: 10px;
// }
// .v-data-table-header__content {
//   // display: flex;
//   // align-items: center;
//   // padding-bottom: 9px;
// }
</style>
