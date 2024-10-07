<template>
  <v-switch v-model="isMobileView" class="mr-1" label="" />
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { computed } from "vue"

const store = useQuranStore()

const isMobileView = computed({
  get: () => store.getVersesMobileView,
  set: (value) => store.setVersesMobileView(value),
})
</script>

<style scoped></style>
