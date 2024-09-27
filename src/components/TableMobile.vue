<template></template>

<script setup lang="ts">
import { defineProps, computed, watch, onMounted, defineEmits } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { ref } from "vue"

const selectedItem = ref(null)
const emit = defineEmits<{
  (e: "activateRowItem", item: String): void
}>()
const props = defineProps<{
  data: any
  tableInputText?: string
  activeItemKey: string | number
  activeItemClass: string
  headerKeys: string[]
}>()

const isTargetedRow = (item: any) => {
  return selectedItem.value === item
}

const selectItem = (item: any) => {
  selectedItem.value = item.verseNumberToQuran
  emit("activateRowItem", item)
}
onMounted(() => {
  selectedItem.value = props.activeItemKey
})
</script>

<style scoped>
.table-mobile-view {
  max-height: 451px;
  overflow-y: scroll;
}
</style>
