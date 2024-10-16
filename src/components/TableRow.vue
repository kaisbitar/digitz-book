<template>
  <tr
    class="tableItem"
    :class="{ [scrollingItemClass]: isTargetedRow }"
    @click="$emit('rowClicked', item)"
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

const props = withDefaults(
  defineProps<{
    item: any
    index: number
    search?: string
    activeItemKey?: string | number
    scrollingItemClass: string
    headerKeys: string[]
    isIndexItem?: boolean
  }>(),
  {
    isIndexItem: false, // or whatever default makes sense for your component
  }
)

const computedIndex = computed(() =>
  props.isIndexItem ? props.index : props.index + 1
)

const isTargetedRow = computed(() => {
  let targetKey = "verseNumberToQuran"
  if (props.isIndexItem) {
    targetKey = "fileName"
  }
  if (props.activeItemKey === undefined) {
    return false
  }
  return props.activeItemKey === String(props.item[targetKey])
})
</script>

<style scoped></style>
