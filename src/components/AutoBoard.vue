<template>
  <AppInputField
    :modelValue="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${totalWordsCount} كلمة`"
    :type="'word-count'"
    :hasError="inputHasError"
    :errorMessage="errorMessage"
    :hasSuccess="inputHasSuccess"
    @update:modelValue="handleInput"
    @clear="handleClear"
    @focus="onFocus"
    @keydown.enter="handleTarteel"
  >
    <AutoMenu
      :menu="menu"
      :tarteel="tarteel"
      :currentWordsList="currentWordsList"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      :checkedItems="checkedItems"
      @update:menu="menu = $event"
      @update:items="updateWordsList"
      @update:checkedItems="updateCheckedItems"
      @submitTarteel="handleTarteel"
    />
  </AppInputField>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/tarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"
import { useRouter } from "vue-router"
import AppInputField from "./AppInputField.vue"

const dataStore = useDataStore()
const tarteelStore = useTarteelStore()
const router = useRouter()
const {
  tarteel,
  menu,
  currentLetter,
  currentWordsList,
  totalWordsCount,
  checkedItems,
  onInput,
  onFocus,
  clearInput,
  updateWordsList,
  storeTarteels,
  updateCheckedItems,
} = useAutoComplete(dataStore, tarteelStore)

const inputHasError = ref(false)
const errorMessage = ref("")
const inputHasSuccess = ref(false)
const emit = defineEmits(["update:isInputVisible"])

const handleTarteel = () => {
  emit("update:isInputVisible", false)
  if (tarteel.value === "" || currentWordsList.value.length === 0) return
  if (checkedItems.value.length > 0) {
    storeTarteels(checkedItems.value)
  } else {
    storeTarteels(currentWordsList.value)
  }
  updateCheckedItems([])
  updateWordsList([])
  tarteel.value = ""
  menu.value = false
  router.push({ name: "tarteel" })
}

const handleInput = (value) => {
  onInput(value)
  menu.value = true
  if (currentWordsList.value.length > 0) {
    inputHasSuccess.value = true
    inputHasError.value = false
    errorMessage.value = ""
    return
  }
  inputHasSuccess.value = false
  inputHasError.value = true
  errorMessage.value = "Input is too long"
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
