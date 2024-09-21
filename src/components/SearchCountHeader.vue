<template>
  <v-btn @click="handleBtnClick" color="primary" variant="outlined">
    <v-icon left>mdi-format-list-bulleted</v-icon>
    ابحث
  </v-btn>
  "{{ searchQuery }}"

  <v-chip
    :color="resultsCount > 0 ? 'green' : 'red'"
    class="ml-2 font-weight-bold"
  >
    {{ wordCount }} مرة
  </v-chip>
  <span class="text-caption">في</span>
  <v-chip
    color="info"
    :color="resultsCount > 0 ? 'green' : 'red'"
    class="font-weight-bold mr-2"
  >
    {{ resultsCount }} آية</v-chip
  >
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
  resultsCount: {
    type: Number,
  },
})

const emit = defineEmits(["newSearch"])

const handleBtnClick = () => {
  emit("newSearch")
}
</script>

<style></style>
