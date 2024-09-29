<template>
  <div class="table-mobile-view" :class="scrollingContainerClass">
    <v-list
      ><v-list-item
        v-model="selectedItem"
        v-for="(item, index) in data"
        :key="index"
        :active="isTargetedRow(item.verseNumberToQuran)"
        @click="selectItem(item)"
        :active-class="activeItemClass"
      >
        <VerseSummary
          :item="item"
          :index="index"
          :textToHighlight="tableInputText"
          class="tableItem"
        />
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, watch, onMounted, defineEmits } from "vue"
import { ref } from "vue"

const selectedItem = ref("")
const emit = defineEmits<{
  (e: "activateRowItem", item: String): void
}>()
const props = defineProps<{
  data: any
  tableInputText?: string
  activeItemKey: string
  activeItemClass: string
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
  max-height: 74vh;
  overflow-y: scroll;
  margin-top: -16px !important;
}
</style>
