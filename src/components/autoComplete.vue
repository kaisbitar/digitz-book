<template>
  <AppInputField
    v-model="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${wordsVariantsCount} كلمة`"
    :type="'verseCount'"
    @update:modelValue="handleInput"
    @clear="clearInput"
    @focus="onFocus"
  >
    <AutoCompleteMenu
      :menu="menu"
      :tarteel="tarteel"
      :currentTarteelResults="currentTarteelResults"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      @update:menu="menu = $event"
      @update:items="currentTarteelResults = $event"
      @tarteelAll="handleTarteelAll"
    />
  </AppInputField>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"
import { watch } from "vue"

import AppInputField from "./AppInputField.vue"
import AutoCompleteMenu from "./AutoCompleteMenu.vue"

const store = useStore()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()

const {
  tarteel,
  menu,
  currentLetter,
  currentTarteelResults,
  totalWordsCount,
  wordsVariantsCount,
  onInput,
  onFocus,
  clearInput,
  updateEditableItems,
  setTarteelAllResults,
} = useAutoComplete(dataStore, tarteelStore)

const handleTarteelAll = (items) => {
  setTarteelAllResults(items)
}

watch(tarteel, (newValue) => {
  if (newValue.length > 0) {
    tarteelStore.setTarteelResults([
      {
        word: newValue,
        count: totalWordsCount.value,
      },
    ])
  } else {
    tarteelStore.setTarteelResults([])
  }
})

// New watcher to keep tarteelResults in sync with currentTarteelResults
watch(
  currentTarteelResults,
  (newValue) => {
    if (newValue.length > 0) {
      tarteelStore.setTarteelResults(newValue)
    }
  },
  { deep: true }
)

const handleInput = (value) => {
  onInput(value)
  if (value.length > 0) {
    tarteelStore.setTarteelResults([
      {
        word: value,
        count: totalWordsCount.value,
      },
    ])
  } else {
    tarteelStore.setTarteelResults([])
  }
}
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  /* background-color: rgb(var(--v-theme-surface)) !important; */
}
</style>
