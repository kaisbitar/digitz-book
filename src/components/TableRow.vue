<template>
  <tr
    class="tableItem"
    :class="{ [activeItemClass]: isTargetedRow(item, index, activeItemKey) }"
    @click="$emit('activateRowItem', item)"
  >
    <td>{{ computedIndex }}</td>
    <template v-for="key in headerKeys" :key="key">
      <td
        v-if="String(key) !== 'index'"
        v-html="highlight(item[key], search)"
      ></td>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

const props = defineProps<{
  item: any
  index: number
  search?: string
  activeItemKey: string | number
  activeItemClass: string
  headerKeys: string[] // Add headerKeys prop
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
