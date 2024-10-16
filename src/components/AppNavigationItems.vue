<template>
  <v-list>
    <v-list-item @click="$emit('toggleRail')">
      <template v-slot:prepend>
        <v-icon>mdi-menu</v-icon>
      </template>
      <v-list-item-title>الكتاب المرقوم</v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item
      v-for="item in navigationItems"
      :key="item.route"
      @click="$emit('navigateTo', item.route)"
      :active="activeRoute === item.route"
    >
      <template v-slot:prepend>
        <v-icon>
          {{ activeRoute === item.route ? item.activeIcon : item.icon }}
        </v-icon>
      </template>
      <v-list-item-title>{{ item.label }}</v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>
    <AppSettings :components="[ThemeToggle, AppZoom]" />
  </v-list>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"
import ThemeToggle from "./themeToggle.vue"
import AppZoom from "./AppZoom.vue"
defineProps(["activeRoute"])
defineEmits(["navigateTo", "toggleRail"])

const navigationItems = [
  {
    route: "/",
    icon: "mdi-home-variant-outline",
    activeIcon: "mdi-home-variant",
    label: "Home",
  },
  {
    route: "sura",
    icon: "mdi-book-open-outline",
    activeIcon: "mdi-book-open",
    label: "السور",
  },
  {
    route: "search",
    icon: "mdi-database-search-outline",
    activeIcon: "mdi-database-search",
    label: "ترتيل",
  },
  {
    route: "/",
    icon: "mdi-account-outline",
    activeIcon: "mdi-account",
    label: "تفسيري",
  },
]
</script>

<style scoped></style>
