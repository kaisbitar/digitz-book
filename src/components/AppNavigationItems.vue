<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    :rail="isRail"
    location="right"
    :temporary="isPermanent"
    :permanent="!isTemporary"
  >
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
  </v-navigation-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"
import ThemeToggle from "./themeToggle.vue"
import AppZoom from "./AppZoom.vue"

defineProps([
  "activeRoute",
  "navigationItems",
  "isRail",
  "isPermanent",
  "isTemporary",
  "drawer",
])
defineEmits(["navigateTo", "toggleRail", "update:drawer"])
</script>

isRail isTemporary isPermanent
<style scoped></style>
