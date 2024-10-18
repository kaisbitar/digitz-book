<template>
  <div
    v-for="(data, key) in metaData"
    :key="key"
    class="d-flex align-end ml-3 mb-1"
  >
    <span class="text-caption ml-1 count-key-item" :class="data.color">{{
      key
    }}</span>
    <span class="text-caption count-value-item">{{ data.value }}</span>
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

<style scoped>
.count-key-item {
  font-weight: bold;
}
</style>
