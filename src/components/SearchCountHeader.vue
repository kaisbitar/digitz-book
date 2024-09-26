<template>
  "{{ searchQuery }}"
  <v-chip
    class="ml-1"
    :color="versesCount > 0 ? 'green' : 'red'"
    variant="tonal"
  >
    <span class="text-caption">{{ wordCount }} مرة</span>
  </v-chip>
  <v-chip color="info" :color="versesCount > 0 ? 'green' : 'red'">
    <span class="text-caption">{{ versesCount }} آية</span>
  </v-chip>
</template>

<script setup>
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
