<template>
  <div
    class="overflow-y-auto"
    ref="tableMobileRef"
    :style="{ height: `${dynamicHeight}px` }"
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
            {
              ['active-table-item']: activeItemKey === item.verseNumberToQuran,
            },
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
  (e: "rowClicked", item: String): void
}>()
const props = defineProps<{
  data: any
  tableInputText?: string
  activeItemKey: string
}>()

const isTargetedRow = (item: any) => {
  return selectedItem.value === item
}

const selectItem = (item: any) => {
  selectedItem.value = item.verseNumberToQuran
  emit("rowClicked", item)
}

const tableMobileRef = ref(null)

const { setContainerHeight, dynamicHeight } = useWindow(tableMobileRef)
useResizeHandler({
  elementRef: tableMobileRef,
  elementFunc: setContainerHeight,
})

onMounted(async () => {
  await nextTick()
  setContainerHeight()
})
</script>

<style scoped>
.overflow-y-auto {
  overflow-y: auto;
}
</style>
