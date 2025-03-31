<template>
  <div class="d-flex">
    <div
      v-for="(data, key) in metaData"
      :key="key"
      class="d-flex align-end ml-3 mb-1"
    >
      <div class="text-caption count-key-item">{{ key }}</div>
      <div class="text-caption mr-1 count-value-item">{{ data.value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  metaData: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped></style>
