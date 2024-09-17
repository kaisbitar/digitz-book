<template>
  <v-app>
    <v-btn @click="toggleTheme">Toggle Theme</v-btn>
    <router-view style="background: rgb(var(--v-theme-surface)) !important" />
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style>
.v-table--density-default {
  --v-table-header-height: 56px !important;
  --v-table-row-height: 31px !important;
}

th {
  padding-top: 2px !important;
  height: 25px !important;
}

.indexStyle .tableItem {
  font-weight: 100;
}

.tableItem {
  cursor: pointer;
}

/* Update hover style for both themes */

.tableStyle td {
  border: none !important;
}

.tableStyle table {
  border-collapse: collapse;
  width: 100%;
  background: rgb(var(--v-theme-highlight-color)) !important;
}
/* Update active item style for both themes */
.activeSuraItem,
.activeTableItemClass {
  color: rgb(var(--v-theme-text-color)) !important;
  font-weight: 500 !important;
  background: rgb(var(--v-theme-highlight-color)) !important;
}

/* Add styles for dark theme */

.v-theme--dark .activeSuraItem,
.v-theme--dark .activeTableItemClass {
  background: rgb(var(--v-theme-highlight-color)) !important;
}

.highlight-match {
  background-color: rgb(var(--v-theme-highlight));
  color: rgb(var(--v-theme-on-highlight));
  font-weight: bold;
}
</style>
