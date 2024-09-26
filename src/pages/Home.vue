<!-- src/components/home.vue -->
<template>
  <v-container class="justify-center fill-height">
    <div class="text-center d-flex">
      <v-col cols="6" class="d-flex flex-column align-center">
        <v-icon @click="goToPage('sura')" size="100">mdi-book</v-icon>
        <h2 class="text-lg theme-text-color">سور</h2>
      </v-col>
      <v-col cols="6" class="d-flex flex-column align-center">
        <v-icon @click="goToPage('search')" size="100">mdi-magnify</v-icon>
        <h2 class="text-lg">ترتيل</h2>
      </v-col>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useQuranStore } from "@/stores/app"

const router = useRouter()
const store = useQuranStore()

const goToPage = (page) => {
  store.setActiveRoute(page)
  router.push(`/${page}`)
}
</script>

<style scoped>
.text-lg {
  font-size: 2rem;
}
.fill-height {
  height: 100vh; /* Full viewport height */
}
</style>
