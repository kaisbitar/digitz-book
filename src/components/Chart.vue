<template>
  <VueApexCharts
    :series="series"
    :options="options"
    :height="chartWindowHeight"
  />
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts"
const chartWindowHeight = computed(() => window.innerHeight - 200)
const props = defineProps(["height", "options", "series"])
</script>

<style>
.apexcharts-toolbar {
  z-index: 1 !important;
}
.apexcharts-tooltip {
  direction: rtl;
}
.apexcharts-tooltip-text-label {
  margin-right: 6px;
  margin-left: 9px;
}
.apexcharts-tooltip-marker {
  margin-right: -5px;
}
.apexcharts-tooltip {
  border: none !important;
  font-size: 19px !important;
  white-space: normal !important;
  max-width: 300px;
  background: rgba(255, 255, 255, 0) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  box-shadow: none !important;
}
.tipInfo2 {
  background: rgb(var(--v-theme-input-background)) !important;
  border-top: 3px solid #4db6ac !important;
}
.tipInfo {
  background: rgb(var(--v-theme-background)) !important;
  border: 1px solid rgb(218, 218, 218);
  border-top: 3px solid #2195f3;
  border-radius: 3px;
  margin: 4px;
  padding: 3px;
  height: fit-content;
}
.tipLabel {
  font-size: 12px;
}
.tipText {
  background: rgb(var(--v-theme-background)) !important;
  border-top: 3px solid rgb(218, 218, 218);
  border-right: 1px solid #cfcfcf;
}
</style>
