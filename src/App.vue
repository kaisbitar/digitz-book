<template>
  <v-app>
    <router-view style="background: rgb(var(--v-theme-surface))" />
  </v-app>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
const { currentBreakpoint } = useWindow()

const store = useQuranStore()

const getTheData = async () => {
  await store.getQuranData()
}
const dynamicFontSize = computed(() => store.getFontSize)

onMounted(() => {
  if (currentBreakpoint.value === "mobile") {
    store.setVersesMobileView(true)
  }
  getTheData()
  document.documentElement.style.setProperty(
    "--dynamic-font-size",
    dynamicFontSize.value
  )
})
</script>

<style lang="scss">
@import "@/styles/styles.scss";
html {
  font-size: var(--font-size);
  // overflow: hidden;
  // position: relative;
}
// body {
// }
.v-application,
.v-overlay-container,
.v-tab,
.text-caption,
.text-h2 {
  // font-family: $body-font-family !important;
  font-family: system-ui !important;
  font-family: unset;
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

.tableStyle td {
  border: none !important;
}

.table-mobile-view .v-list-item {
  background: rgb(var(--v-theme-second-background));
}

.tableStyle tr {
  background: rgb(var(--v-theme-second-background));
}

.sura-text-container {
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

.v-field {
  color: rgb(var(--v-theme-on-active-row)) !important;
  background: rgb(var(--v-theme-input-background)) !important;
}

.highlight-match {
  background-color: rgb(var(--v-theme-highlight));
  color: rgb(var(--v-theme-on-highlight));
}

.not-selected {
  opacity: 0.4 !important;
}
.theme-text-color {
  color: rgb(var(--v-theme-on-surface)) !important;
}
.verses-count {
  color: rgb(var(--v-theme-versesCount)) !important;
}

.word-count {
  color: rgb(var(--v-theme-wordCount)) !important;
}

.letter-count {
  color: rgb(var(--v-theme-letterCount)) !important;
}
.dialog-header {
  display: flex;
  margin-top: -35px;
  position: relative;
  justify-content: flex-end;
  margin-left: 56px;
  align-items: center;
}
</style>
