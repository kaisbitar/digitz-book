<template>
  <v-app-bar class="topHeader" flat app dense>
    <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
    <h3 class="titleText ml-2 font-weight-thin">الكتاب المرقوم</h3>
    <v-spacer></v-spacer>
    <themeToggle class="mt-20" />
  </v-app-bar>
</template>

<script setup>
import { useQuranStore } from '@/stores/app'

const store = useQuranStore()

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState)
}
</script>

<style scoped></style>
