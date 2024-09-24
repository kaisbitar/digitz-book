<template>
  <tr
    class="tableItem"
    :class="{ [activeItemClass]: isTargetedRow(item, index, activeItemKey) }"
    @click="$emit('activateRowItem', item)"
  >
    <td
      v-for="(cellItem, key) in item"
      :key="key"
      class="text-right"
      v-html="highlight(cellItem, search)"
    ></td>
  </tr>
</template>

<script setup lang="ts">
import { defineProps } from "vue"
import { useInputFiltering } from "../mixins/inputFiltering"

const { highlight } = useInputFiltering()

const props = defineProps<{
  item: any
  index: number
  search: string | undefined
  activeItemKey: string | number
  activeItemClass: string
}>()

const isTargetedRow = (item: any, index: number, id: string | number) => {
  if (id === undefined && index === 0) {
    return true
  }
  if (props.activeItemClass === "active-Quran-index") {
    return id === item.fileName
  }
  return id === String(item.verseNumberToQuran)
}
</script>

<style scoped></style>
