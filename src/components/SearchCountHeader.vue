<template>
  <v-container>
    <v-btn v-if="searchQuery && wordCount" variant="tonal">ابحث</v-btn>
    "{{ searchQuery }}"
    <v-chip
      :color="versesCount > 0 ? 'green' : 'red'"
      class="ml-2"
      variant="tonal"
    >
      {{ wordCount }} مرة
    </v-chip>
    <span class="text-caption">في</span>
    <v-chip
      color="info"
      :color="versesCount > 0 ? 'green' : 'red'"
      class="mr-2"
    >
      {{ versesCount }} آية</v-chip
    >
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  searchQuery: {
    type: String,
  },
  wordCount: {
    type: Number,
  },
  versesCount: {
    type: Number,
  },
})
</script>

<style></style>
