<template>
  <AppInputField
    :modelValue="tarteel"
    :fieldPlaceHolder="'القرآن'"
    :dataToShow="`${totalWordsCount} كلمة`"
    :type="'word-count'"
    :hasError="inputHasError"
    :hasSuccess="inputHasSuccess"
    :loading="isLoading"
    @update:modelValue="handleInput($event)"
    @clear="handleClear"
    @focus="onFocus"
    @keydown:enter="handleTarteel"
  >
    <AutoMenu
      class="mt-4"
      :menu="menu"
      :tarteel="tarteel"
      :currentWordsList="currentWordsList"
      :totalWordsCount="totalWordsCount"
      :currentLetter="currentLetter"
      :checkedItems="checkedItems"
      :isLoading="isLoading"
      @update:menu="menu = $event"
      @update:isLoading="isLoading = $event"
      @update:items="updateFilteredList"
      @update:checkedItems="updateCheckedItems"
      @submitTarteel="handleTarteel"
    />
    <template v-slot:append-input-items>
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
  handleInputChange,
  toggleMenu,
  clearInput,
  updateFilteredList,
  storeTarteels,
  updateCheckedItems,
} = useAutoComplete(dataStore, tarteelStore)

const inputHasError = ref(false)
const inputHasSuccess = ref(false)
const isLoading = ref(false)

const emit = defineEmits(["update:isInputVisible"])

const handleInput = async (value) => {
  const hasResults = await handleInputChange(value)

  inputHasSuccess.value = hasResults
  inputHasError.value = !hasResults
  toggleMenu(true)
}

const handleTarteel = () => {
  if (tarteel.value === "" || currentWordsList.value.length === 0) return

  storeTarteels(
    checkedItems.value.length > 0 ? checkedItems.value : currentWordsList.value
  )

  updateCheckedItems([])
  updateFilteredList([])
  clearInput()
  router.push({ name: "tarteel" })
  toggleMenu(false)
}

const handleClear = () => {
  clearInput()
}

const onFocus = () => {
  toggleMenu(true)
}
</script>

<style scoped></style>
