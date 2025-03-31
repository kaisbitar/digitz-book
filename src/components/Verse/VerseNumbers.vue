<template>
  <v-card-subtitle class="count-key-item">
    <span class="text-caption">آية</span>
    <span class="text-h4 count-key-item ml-3">{{ verseIndex }}</span>

    <span class="text-caption">مصحف</span>
    <span class="text-h4 count-key-item">{{ verseNumberToQuran }}</span>
  </v-card-subtitle>
</template>

<script setup>
defineProps({
  verseIndex: Number,
  verseNumberToQuran: Number,
})
</script>
