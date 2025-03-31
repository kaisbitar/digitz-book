<template>
  <v-card-subtitle class="count-key-item">
    <span class="text-h4 count-key-item">{{ numberOfWords }}</span>
    <span class="text-caption ml-3">كلمة</span>

    <span class="text-h4 count-key-item">{{ numberOfLetters }}</span>
    <span class="text-caption ml-3">حرف</span>
  </v-card-subtitle>
</template>

<script setup>
defineProps({
  numberOfWords: [Number],
  numberOfLetters: [Number],
})
</script>
