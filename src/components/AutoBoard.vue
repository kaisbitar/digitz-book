<template>
  <AppInputField
    :modelValue="tarteel"
    :fieldPlaceHolder="placeholder"
    :dataToShow="`${totalWordsCount} كلمة`"
    :type="'word-count'"
    :hasError="inputHasError"
    :hasSuccess="inputHasSuccess"
    :loading="isLoading"
    :autoFocus="false"
    rounded="lg"
    variant="outlined"
    base-color="count-key-item"
    @update:modelValue="handleInput($event)"
    @clear="handleClear"
    @focus="onFocus"
    @keydown:enter="handleTarteel"
  >
    <AutoMenu
      :menu="menu"
      :tarteel="tarteel"
      :currentWordsList="currentWordsList"
      :totalWordsCount="totalWordsCount"
      :suggestions="suggestions"
      :hasSuggestions="hasSuggestions"
      :currentLetter="currentLetter"
      :checkedItems="checkedItems"
      :isLoading="isLoading"
      :showLetterChart="showLetterChart"
      @submitTarteel="handleTarteel"
      @update:menu="menu = $event"
      @update:isLoading="isLoading = $event"
      @update:items="updateFilteredList"
      @update:checkedItems="updateCheckedItems"
      @update:tashkeel="setTashkeelOption"
      @update:tarteel="handleInput($event)"
    />
    <template v-slot:append-input-items v-if="showDeleteButton">
      <v-btn
        icon="mdi-close"
        elevation="0"
        clickable
        class="mx-1"
        size="x-small"
        @click.prevent="emit('update:isInputVisible', false)"
      ></v-btn>
    </template>
  </AppInputField>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useAutoComplete } from "@/hooks/useAutoComplete"
import { useRouter } from "vue-router"
import AppInputField from "./App/AppInputField.vue"

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
  suggestions,
  hasSuggestions,
  handleInputChange,
  toggleMenu,
  clearInput,
  updateFilteredList,
  storeTarteels,
  updateCheckedItems,
  applySuggestion,
  setTashkeelOption,
} = useAutoComplete(dataStore, tarteelStore)

const inputHasError = ref(false)
const inputHasSuccess = ref(false)
const isLoading = ref(false)

const props = defineProps({
  placeholder: {
    type: String,
    default: "ابحث في القرآن الكريم...",
  },
  showLetterChart: {
    type: Boolean,
    default: true,
  },
  isAddingToExisting: {
    type: Boolean,
    default: false,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(["update:isInputVisible", "submitTarteel"])

const handleInput = async (value) => {
  const hasResults = await handleInputChange(value)
  updateCheckedItems([])

  inputHasSuccess.value = hasResults
  inputHasError.value = !hasResults
  toggleMenu(true)
}

const handleTarteel = () => {
  if (tarteel.value === "" || currentWordsList.value.length === 0) return

  storeTarteels(
    checkedItems.value.length > 0 ? checkedItems.value : currentWordsList.value,
    props.isAddingToExisting
  )

  updateCheckedItems([])
  updateFilteredList([])
  clearInput()
  router.push({ name: "tarteel" })
  toggleMenu(false)
  emit("submitTarteel")
}

const handleClear = () => {
  clearInput()
}

const onFocus = () => {
  toggleMenu(true)
}
</script>

<style scoped></style>
