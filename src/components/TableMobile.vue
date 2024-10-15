<template>
  <div
    class="table-mobile-view"
    ref="tableMobileRef"
    :style="{ height: `${dynamicTableHeight}px` }"
  >
    <v-item-group
      :selected-class="scrollingItemClass"
      v-for="(item, index) in data"
      :key="item.verseNumberToQuran"
    >
      <v-item v-slot="{ isSelected, selectedClass, toggle }">
        <VerseCardItem
          :item="item"
          :index="index"
          :textToHighlight="tableInputText"
          :active="isTargetedRow(item.verseNumberToQuran)"
          :class="[selectedClass]"
          @verse-clicked="selectItem(item), toggle()"
        />
      </v-item>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue"
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
  headerKeys: string[]
  scrollingContainerClass: string
}>()

const isTargetedRow = (item: any) => {
  return selectedItem.value === item
}

const selectItem = (item: any) => {
  selectedItem.value = item.verseNumberToQuran
  emit("activateRowItem", item)
}

const tableMobileRef = ref(null)

const { setContainerHeight, dynamicTableHeight } = useWindow()

const { screen, handleResize } = useResizeHandler({
  elementRef: tableMobileRef,
  updateHeight: () => setContainerHeight(tableMobileRef),
})

onMounted(async () => {
  selectedItem.value = props.activeItemKey
  await nextTick()
  setContainerHeight(tableMobileRef)
})
</script>

<style scoped>
.table-mobile-view {
  overflow-y: auto;
}
</style>
