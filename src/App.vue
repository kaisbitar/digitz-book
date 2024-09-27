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
const dynamicFontSize = computed(() => store.getFontSize)

onMounted(() => {
  getTheData()
  document.documentElement.style.setProperty(
    "--dynamic-font-size",
    dynamicFontSize.value
  )
  document.documentElement.style.setProperty("font-size", dynamicFontSize.value)
})
</script>

<style lang="scss">
@import "@/styles/styles.scss";
html {
  font-size: var(--font-size);
}
body {
  overflow: hidden;
}
.v-application,
.v-overlay-container,
.v-tab,
.text-caption {
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
  height: 5px !important;
}

.tableItem {
  cursor: pointer;
}

.tableStyle tr {
  background: rgb(var(--v-theme-second-background));
}

.tableStyle td {
  border: none !important;
}

.sura-text-container {
  background: rgb(var(--v-theme-second-background));
}
.table-style-mobile .v-list-item {
  background: rgb(var(--v-theme-second-background));
}

.activeSuraItem,
.active-verse-table,
.active-verse,
.active-Quran-index {
  color: rgb(var(--v-theme-on-active-row)) !important;
  background: rgb(var(--v-theme-active-row)) !important;
  // font-weight: 700;
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
