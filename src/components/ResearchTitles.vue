<template>
  <v-chip-group
    :v-model="selectedChipIndex"
    mandatory
    show-arrows
    color="primary"
    variant="tonal"
    ><v-tooltip location="right" open>
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          size="x-small"
          color="red-lighten-2"
          class="mt-3"
          @click="handleResearchReset"
          >mdi-delete</v-icon
        >
      </template>
      <span>حذف الكل</span>
    </v-tooltip>
    <v-chip
      v-for="(item, index) in research"
      :key="index"
      :class="chipClasses(index)"
      icon-size="large"
      closable
      @click="handleClickedChip(index)"
      @click:close="handleRemovedChip"
    >
      <v-chip size="x-small" class="theme-text-color mr-n1 ml-1">{{
        item.wordCount
      }}</v-chip>
      <span class="theme-text-color">{{ item.inputText }}</span>
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { computed } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const props = defineProps({})

const emit = defineEmits([])

const research = computed(() => store.getResearchResults)
const selectedChipIndex = computed(() => store.getSelectedSearchIndex)

const chipClasses = computed(() => (index) => [
  index === selectedChipIndex.value ? "selected-chip" : "not-selected",
])

const handleClickedChip = (index) => {
  store.setSearchIndex(index)
}

const handleRemovedChip = (index) => {
  store.setRemoveSearchItem(index)
  store.setSearchIndex(index - 1)
}

const handleResearchReset = () => {
  store.resetResearchResults()
}
</script>

<style scoped>
/* .selected-chip {
  color: rgb(var(--v-theme-primary)) !important;
} */
/* .count-color,
.custom-close-icon ::v-deep(.v-chip__close) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.5 !important;
} */
</style>
