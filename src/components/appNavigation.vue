<template>
  <v-app-bar-nav-icon
    v-for="(item, index) in navItems"
    :key="index"
    :value="item.route"
    :active="activeRoute === item.route"
    @click="$emit('navigateTo', item.route)"
  >
    <v-icon>{{ item.icon }}</v-icon>
  </v-app-bar-nav-icon>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps(["activeRoute"])
const emit = defineEmits(["navigateTo"])

const navItems = ref([
  { icon: "mdi-book-open-outline", route: "sura" },
  { icon: "mdi-database-search", route: "search" },
])
</script>

<style scoped>
.v-app-bar-nav-icon.v-btn--active .v-icon {
  color: rgb(var(--v-theme-primary));
}
</style>
