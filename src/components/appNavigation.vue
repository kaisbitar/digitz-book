<template>
  <v-btn @click="navigateTo('search')" icon>
    <v-icon class="mr-1">mdi-magnify</v-icon>
  </v-btn>
  <v-btn @click="navigateTo('sura')" icon>
    <v-icon class="mr-1">mdi-book-open-variant</v-icon>
  </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuranStore } from '@/stores/app' // Adjust the import path as needed
import { useQuranNavigation } from '@/mixins/QuranNavigation'

const router = useRouter()
const store = useQuranStore()
const { navigateToTargetedSuraAndVerse } = useQuranNavigation()

const navigateTo = route => {
  if (router.currentRoute.value.name !== route) {
    router.push({ name: route })
    store.setSearchIndex(-1)
  }
}
</script>

<style></style>
