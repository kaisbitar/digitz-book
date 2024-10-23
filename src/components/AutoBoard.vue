<template>
  <AppInputField
    :modelValue="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${totalWordsCount} كلمة`"
    :type="'verse-count'"
    @update:modelValue="handleInput"
    @clear="handleClear"
    @focus="onFocus"
  >
    <AutoMenu
      :menu="menu"
      :tarteel="tarteel"
      :currentFilteredWords="currentFilteredWords"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      :checkedItems="checkedItems"
      @update:menu="menu = $event"
      @update:items="updateEditableItems"
      @update:checkedItems="updateCheckedItems"
      @submitTarteel="handleTarteel"
      @add-item="addItem"
      @remove-item="removeItem"
    />
  </AppInputField>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"

import AppInputField from "./AppInputField.vue"

const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const {
  tarteel,
  menu,
  currentLetter,
  currentFilteredWords,
  totalWordsCount,
  checkedItems,
  onInput,
  onFocus,
  clearInput,
  updateEditableItems,
  storeTarteels,
  updateCheckedItems,
} = useAutoComplete(dataStore, tarteelStore)

const handleTarteel = () => {
  if (checkedItems.value.length > 0) {
    storeTarteels(checkedItems.value)
  } else {
    storeTarteels(currentFilteredWords.value)
  }
  updateCheckedItems([])
  updateEditableItems([])
  tarteel.value = ""
  menu.value = false
}

const handleInput = (value) => {
  onInput(value)
  menu.value = true
}

const handleClear = () => {
  clearInput()
  menu.value = true
}

// const updateCheckedItems = (newItems) => {
//   checkedItems.value = newItems
// }

const addItem = (item) => {
  // Handle adding item
}

const removeItem = (item) => {
  // Handle removing item
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
