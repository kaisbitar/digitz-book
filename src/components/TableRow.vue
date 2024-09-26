<template>
  <tr
    class="tableItem"
    :class="{ [activeItemClass]: isTargetedRow(item, index, activeItemKey) }"
    @click="$emit('activateRowItem', item)"
  >
    <td>{{ computedIndex }}</td>
    <td v-for="(cellItem, key) in item" :key="key">
      <span
        v-if="String(key) !== 'index'"
        :key="key"
        v-html="highlight(cellItem, search)"
      ></span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

const props = defineProps<{
  item: any
  index: number
  search?: string
  activeItemKey: string | number
  activeItemClass: string
}>()
const computedIndex = computed(() =>
  props.activeItemClass == "active-Quran-index" ? props.index : props.index + 1
)

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
