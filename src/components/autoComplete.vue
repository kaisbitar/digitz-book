<template>
  <AppInputField
    v-model="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${wordsVariantsCount} كلمة`"
    :type="'verseCount'"
    @update:modelValue="onInput"
    @clear="clearInput"
    @focus="onFocus"
  >
    <AutoCompleteMenu
      :menu="menu"
      :tarteel="tarteel"
      :selectedTarteels="selectedTarteels"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      @update:menu="menu = $event"
      @update:items="selectedTarteels = $event"
      @tarteelAll="handleTarteelAll"
    />
  </AppInputField>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"

import AppInputField from "./AppInputField.vue"
import AutoCompleteMenu from "./AutoCompleteMenu.vue"

const store = useStore()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const {
  tarteel,
  menu,
  currentLetter,
  selectedTarteels,
  totalWordsCount,
  wordsVariantsCount,
  onInput,
  onFocus,
  clearInput,
  updateEditableItems,
  setTarteelAllResults,
} = useAutoComplete(dataStore, tarteelStore)

// Add the handleTarteelAll method
const handleTarteelAll = (items) => {
  setTarteelAllResults(items)
  // Add any additional logic you need for handling "tarteelAll" action
}

// ... existing code ...
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgb(var(--v-theme-background));
}
</style>

<!-- const scrollToTop = () => {
  nextTick(() => {
    if (FilteredWordsList.value) {
      const listElement = FilteredWordsList.value.$el.querySelector(".v-list")
      if (listElement) {
        listElement.scrollTop = 0
      }
    }
    scrollToActiveItem(".active-verse-text", ".sura-text-container")
  })
} -->
<!-- 

 -->
