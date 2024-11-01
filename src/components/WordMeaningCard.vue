<template>
  <v-card :variant="variant" :class="cardClass">
    <v-card-item v-for="(item, index) in meanings" :key="index">
      <v-card-title class="ml-2 count-key-item">{{ item.word }}</v-card-title>
      <v-card-text class="mb-n5">{{ item.meaning }}</v-card-text>
      <span class="text-caption count-key-item">{{ item.dictionary }}</span>
      <v-divider horizontal length="50%" class="mt-7" />
    </v-card-item>
  </v-card>
</template>

<script setup>
defineProps({
  meanings: {
    type: Array,
    required: true,
  },
  variant: {
    type: String,
    default: "text",
  },
  cardClass: {
    type: String,
    default: "",
  },
})
</script>
