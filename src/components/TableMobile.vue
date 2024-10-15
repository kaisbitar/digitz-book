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
import { onMounted, onUnmounted, ref, nextTick } from "vue"
import { useWindow } from "@/mixins/window"

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
let resizeObserver = null

const { updateTableHeight, dynamicTableHeight } = useWindow()

const updateHeight = async () => {
  await nextTick()
  updateTableHeight(tableMobileRef)
}

onMounted(async () => {
  selectedItem.value = props.activeItemKey
  window.addEventListener("resize", updateHeight)
  resizeObserver = new ResizeObserver(() => {
    updateHeight()
  })
  resizeObserver.observe(tableMobileRef.value)
  updateHeight()
})

onUnmounted(() => {
  window.removeEventListener("resize", updateHeight)
})
</script>

<style scoped>
.table-mobile-view {
  overflow-y: auto;
}
</style>
