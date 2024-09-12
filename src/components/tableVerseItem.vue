<template>
  <td @click="$emit('itemClicked')" class="text-right" v-html="highlight(cellItem, search)"></td>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  cellItem: {
    type: [String, Number],
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
})

const highlight = (text, searchValue) => {
  if (!searchValue) {
    return text
  }
  return text.replace(new RegExp(searchValue, 'gi'), match => {
    return '<span style="background:yellow; font-weight: bold;">' + match + '</span>'
  })
}
</script>

<style></style>
