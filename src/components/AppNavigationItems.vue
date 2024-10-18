<template>
  <v-navigation-drawer @update:model-value="$emit('update:drawer', $event)">
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
    <AppNavDropDown :components="[ThemeOptions]" />
  </v-navigation-drawer>
</template>

<script setup>
import ThemeOptions from "./AppTheme.vue"

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

<style scoped></style>
