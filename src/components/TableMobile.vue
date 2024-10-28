<template>
  <div ref="tableMobileRef" class="sura-board-overflow">
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
              ['active-verse-table']: activeItemKey === item.verseNumberToQuran,
            },
          ]"
          @verse-clicked="selectItem(item), toggle()"
        />
      </v-item>
    </v-item-group>
    <div class="mt-7 mb-7 text-center">صدق الله العظيم</div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue"

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

onMounted(async () => {
  await nextTick()
})
</script>

<style scoped></style>
