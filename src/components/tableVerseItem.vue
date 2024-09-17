<template>
  <td @click="$emit('itemClicked')" class="text-right" v-html="highlight(cellItem, search)"></td>
</template>

<script setup>
import { defineProps } from 'vue'
import { useTableOcc } from '../mixins/tableOccMixin'
const { highlight } = useTableOcc()

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
</script>

<style></style>
