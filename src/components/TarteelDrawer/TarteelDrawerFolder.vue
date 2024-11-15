<template>
  <div v-for="(item, index) in items" :key="index">
    {{ item.inputText }}
    {{ item.results.length }}
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
  selectedItem: {
    type: Number,
    default: null,
  },
  itemIcon: {
    type: String,
    default: "mdi-folder",
  },
})

defineEmits(["selectItem", "deleteItem"])
</script>
