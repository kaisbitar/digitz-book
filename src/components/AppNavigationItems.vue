<template>
  <v-list>
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
  </v-list>
  <AppSettings :components="[ThemeToggle, AppZoom]" />
</template>

<script setup>
import { defineProps, defineEmits } from "vue"
import ThemeToggle from "./themeToggle.vue"
import AppZoom from "./AppZoom.vue"

defineProps(["activeRoute", "navigationItems"])
defineEmits(["navigateTo", "toggleRail"])
</script>

<style scoped></style>
