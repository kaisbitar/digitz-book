<template>
  <v-app>
    <router-view style="background: rgb(var(--v-theme-surface))" />
  </v-app>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const getTheData = async () => {
  await store.getQuranData()
}

onMounted(() => {
  getTheData()
})
</script>

<style lang="scss">
@import "@/styles/styles.scss";
html {
  font-size: 19px !important;
}
body {
  overflow: hidden;
}
.v-application,
.v-overlay-container,
.v-tab {
  // font-family: $body-font-family !important;
  font-family: system-ui !important;
  font-family: unset;
}

.v-selection-control {
  background: rgb(var(--v-theme-surface)) !important;
}
.v-table--density-default {
  --v-table-header-height: 56px !important;
  --v-table-row-height: 31px !important;
}

th {
  padding-top: 2px !important;
  height: 25px !important;
}

.tableItem {
  cursor: pointer;
  font-weight: 200;
}

.tableStyle tr {
  background: rgb(var(--v-theme-second-background));
}

.tableStyle td {
  border: none !important;
}
// .tableStyle table {
//   border-collapse: collapse;
//   width: 100%;
//   background: rgb(var(--v-theme-highlight-color)) !important;
// }

.activeSuraItem,
.active-verse-table,
.active-verse,
.active-Quran-index {
  color: rgb(var(--v-theme-on-active-row)) !important;
  background: rgb(var(--v-theme-active-row)) !important;
  font-weight: 300 !important;
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

.not-selected {
  opacity: 0.4 !important;
}
.theme-text-color {
  color: rgb(var(--v-theme-on-surface)) !important;
}
</style>
