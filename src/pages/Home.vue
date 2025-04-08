<!-- src/components/home.vue -->
<template>
  <v-row class="justify-center fill-height">
    <v-col cols="6" class="d-flex flex-column align-center">
      <v-icon @click="goToPage('sura')" size="100"
        >mdi-book-open-variant-outline</v-icon
      >
      <h2 class="text-lg theme-text-color">سور</h2>
    </v-col>
    <v-col cols="6" class="d-flex flex-column align-center">
      <v-icon @click="goToPage('tarteel')" size="100"
        >mdi-database-search-outline</v-icon
      >
      <h2 class="text-lg">ترتيل</h2>
    </v-col>
    <v-col cols="6" class="d-flex flex-column align-center">
      <v-icon @click="goToPage('tafsiri')" size="100"
        >mdi-account-outline</v-icon
      >
      <h2 class="text-lg">تدبري</h2>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useStore } from "@/stores/appStore"

const router = useRouter()
const store = useStore()

const goToPage = (page) => {
  store.setActiveRoute(page)
  router.push(`/${page}`)
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
