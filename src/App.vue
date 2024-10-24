<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useWindow } from "@/mixins/window"
const { windowWidth } = useWindow()

const store = useStore()
const dataStore = useDataStore()

const getTheData = async () => {
  await dataStore.getQuranData()
}

onMounted(async () => {
  if (windowWidth.value === "small") {
    store.setVersesMobileView(true)
  }
  await getTheData()
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";
// $body-font-family: "Cairo", sans-serif;
$body-font-family: "Almarai", sans-serif;

.v-application {
  font-family: $body-font-family !important;
}
html {
  overflow: hidden;
  position: relative;
}
// body {
// }
.v-application,
.v-overlay-container,
.v-tab,
.text-caption,
.text-h2,
.text-h4,
.text-h6,
.text-sm-h4,
.text-sm-h5,
.text-sm-h3,
.text-h4 {
  font-family: $body-font-family !important;
  // font-family: system-ui !important;
  font-family: unset;
}

.v-table--density-default {
  --v-table-header-height: 56px !important;
  --v-table-row-height: 31px !important;
}

th {
  // height: 10px !important;
}

.tableItem {
  cursor: pointer;
}

.tableStyle td {
  border: none !important;
}

.highlight-match {
  color: rgb(var(--v-theme-on-highlight));
  background: rgb(var(--v-theme-highlight)) !important;
  text-shadow: 0px 0px 3px rgb(var(--v-theme-on-highlight), 0.3);
  font-weight: bold;
  padding: 2px;
}

.count-key-item,
.verse-card-item-title {
  letter-spacing: 0 !important;
  color: rgb(var(--v-theme-count-key-item));
}

.v-card-text.verse-card-item-text {
  font-size: 19px;
  max-width: 1083px;
}

.text-caption {
  font-size: 14px !important;
}

.v-card-subtitle {
  font-size: 16px !important;
}

.activeSuraItem,
.active-verse-table,
.active-verse-text,
.active-index-item {
  background: rgb(var(--v-theme-active-row)) !important;
  .verse-card-item-text {
    text-shadow: 0px 0px 3px rgb(var(--v-theme-on-active-row), 0);
  }
  .verse-card-item-title {
    text-shadow: 0px 0px 1px rgb(var(--v-theme-on-highlight), 15%);
    color: inherit;
  }
}

.v-card {
  border-color: rgba(var(--v-theme-on-surface), 0.1) !important;
}

.dialog-header {
  display: flex;
  margin-top: -36px;
  position: relative;
  justify-content: flex-end;
  margin-left: 56px;
  align-items: center;
}
.v-application,
.v-tab,
.v-btn,
.v-card-subtitle,
.v-card-text,
.text-caption,
.text-sm-h3,
.text-h4 {
  letter-spacing: 0 !important;
}
</style>
