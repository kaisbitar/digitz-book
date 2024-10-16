<template>
  <div
    class="table-mobile-view"
    ref="tableRef"
    :style="{ height: `${dynamicHeight}px` }"
    :class="scrollingContainerClass"
  >
    <v-item-group v-for="(item, index) in data" :key="item.verseNumberToQuran">
      <v-item v-slot="{ isSelected, selectedClass, toggle }">
        <VerseCardItem
          :item="item"
          :index="index"
          :textToHighlight="tableInputText"
          :active="isTargetedRow(item.verseNumberToQuran)"
          :class="[
            selectedClass,
            { [scrollingItemClass]: activeItemKey === item.verseNumberToQuran },
          ]"
          @verse-clicked="selectItem(item), toggle()"
        />
      </v-item>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

const selectedItem = ref(null)
const emit = defineEmits<{
  (e: "activateRowItem", item: String): void
}>()
const props = defineProps<{
  data: any
  tableInputText?: string
  activeItemKey: string
  scrollingItemClass: string
  scrollingContainerClass: string
}>()

const isTargetedRow = (item: any) => {
  return selectedItem.value === item
}

const selectItem = (item: any) => {
  selectedItem.value = item.verseNumberToQuran
  emit("activateRowItem", item)
}

const tableRef = ref(null)

const { setContainerHeight, dynamicHeight } = useWindow(tableRef)
useResizeHandler({
  elementRef: tableRef,
  elementFunc: setContainerHeight,
})

onMounted(async () => {
  await nextTick()
  setContainerHeight()
})

// defineExpose({ tableRef })
</script>

<style scoped>
.table-mobile-view {
  overflow-y: auto;
}
</style>
