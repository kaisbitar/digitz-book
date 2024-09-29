<template>
  <v-btn
    @click="handleShowVersesMobileView"
    class="mr-1"
    size="large"
    variant="outlined"
  >
    <v-icon>
      {{ isMobileView ? "mdi-format-list-bulleted" : "mdi-table" }}
    </v-icon>
  </v-btn>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

const isMobileView = computed(() => store.getVersesMobileView)

const handleShowVersesMobileView = () => {
  store.setVersesMobileView(!store.getVersesMobileView)
}
</script>

<style scoped></style>
