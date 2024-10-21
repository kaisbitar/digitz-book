<template>
  <AppInputField
    v-model="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${totalWordsCount} كلمة`"
    :type="'verseCount'"
    @update:modelValue="handleInput"
    @clear="handleClear"
    @focus="onFocus"
  >
    <AutoCompleteMenu
      :menu="menu"
      :tarteel="tarteel"
      :currentFilteredWords="currentFilteredWords"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      @update:menu="menu = $event"
      @update:items="updateEditableItems"
      @tarteelAll="handleTarteelAll"
    />
  </AppInputField>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"

import AppInputField from "./AppInputField.vue"
import AutoCompleteMenu from "./AutoCompleteMenu.vue"

const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const {
  tarteel,
  menu,
  currentLetter,
  currentFilteredWords,
  totalWordsCount,
  onInput,
  onFocus,
  clearInput,
  updateEditableItems,
  setTarteelAllResults,
} = useAutoComplete(dataStore, tarteelStore)

const handleTarteelAll = (items) => {
  setTarteelAllResults(items)
}

const handleInput = (value) => {
  onInput(value)
  menu.value = true
}

const handleClear = () => {
  clearInput()
  menu.value = true
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
