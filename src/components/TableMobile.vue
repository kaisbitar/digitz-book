<template>
  <div class="table-mobile-view" :class="scrollingContainerClass">
    <v-item-group :selected-class="scrollingItemClass">
      <div v-for="(item, index) in data" :key="item.verseNumberToQuran">
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
      </div>
    </v-item-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { ref } from "vue"

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
onMounted(() => {
  selectedItem.value = props.activeItemKey
})
</script>

<style scoped>
.table-mobile-view {
  min-height: 70vh;
  max-height: 70vh;
  overflow-y: scroll;
}
</style>
