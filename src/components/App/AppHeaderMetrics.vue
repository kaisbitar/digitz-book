<template>
  <template v-for="(item, index) in metrics" :key="index">
    <span class="text-h6 count-key-item">{{ item.value }}</span>
    <span class="text-caption ml-5 mr-1">{{ item.label }}</span>
  </template>
</template>

<script setup>
defineProps({
  metrics: {
    type: Array,
    required: true,
    // Expected format: [{ value: number|string, label: string }]
  },
  containerClass: {
    type: String,
    default: "",
  },
})
</script>
