<template>
  <v-app-bar height="50" flat app dense>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>الكتاب المرقوم</v-app-bar-title>
    <v-spacer></v-spacer>
    <AppNavigation />
    <AppDropMenu :components="[ThemeToggle]"> </AppDropMenu>
  </v-app-bar>
</template>

<script setup>
import { useQuranStore } from "@/stores/app";
import ThemeToggle from "./ThemeToggle.vue";

const store = useQuranStore();

const toggleDrawer = () => {
  store.setDrawerState(!store.getDrawerState);
};
</script>

<style scoped></style>
