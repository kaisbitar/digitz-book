<template>
  <v-app>
    <v-btn @click="toggleTheme">Toggle Theme</v-btn>
    <router-view style="background: rgb(var(--v-theme-surface))" />
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { useQuranStore } from '@/stores/app'

const store = useQuranStore()
const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const getTheData = async () => {
  await store.getQuranData()
}

onMounted(() => {
  getTheData()
})
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
  color: rgb(var(--v-theme-on-active-row)) !important;
  font-weight: 500 !important;
  background: rgb(var(--v-theme-active-row)) !important;
}

.v-input__control {
  color: rgb(var(--v-theme-on-active-row)) !important;
  background: rgb(var(--v-theme-input-background)) !important;
}

.highlight-match {
  background-color: rgb(var(--v-theme-highlight));
  color: rgb(var(--v-theme-on-highlight));
  font-weight: bold;
}
</style>
