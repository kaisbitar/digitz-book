<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
const { windowWidth } = useWindow()

const store = useQuranStore()

const getTheData = async () => {
  await store.getQuranData()
}
const dynamicFontSize = computed(() => store.getFontSize)

onMounted(async () => {
  if (windowWidth.value === "small") {
    store.setVersesMobileView(true)
  }
  await getTheData()
  document.documentElement.style.setProperty(
    "--dynamic-font-size",
    dynamicFontSize.value
  )
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
  font-size: var(--font-size);
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
.text-sm-h4,
.text-sm-h5 {
  font-family: $body-font-family !important;
  // font-family: system-ui !important;
  font-family: unset;
}

.v-tab,
.v-btn {
  letter-spacing: 0 !important;
}

.v-table--density-default {
  --v-table-header-height: 56px !important;
  --v-table-row-height: 31px !important;
}

th {
  // height: 5px !important;
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
// .count-value-item,
.verse-card-item-title {
  color: rgb(var(--v-theme-count-value-item));
}

.activeSuraItem,
.active-verse-table,
.active-verse-text,
.active-index-item {
  background: rgb(var(--v-theme-active-row)) !important;
  // .count-value-item,
  // .verse-card-item-text {
  //   text-shadow: 0px 0px 3px rgb(var(--v-theme-on-highlight), 0);
  //   font-weight: bold;
  //   color: rgb(var(--v-theme-on-active-row));
  // }
}

.dialog-header {
  display: flex;
  margin-top: -36px;
  position: relative;
  justify-content: flex-end;
  margin-left: 56px;
  align-items: center;
}
</style>
