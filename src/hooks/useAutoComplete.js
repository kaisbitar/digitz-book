import { ref, computed, watch } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const currentFilteredWords = ref([])
  const totalWordsCount = ref(0)

  const filteredWords = computed(() => {
    if (!tarteel.value) {
      return { results: [] }
    }
    if (tarteel.value.length >= 0) {
      return filterWords(tarteel.value, dataStore.getVersesForCounting)
    }
    return { results: [] }
  })

  watch(
    () => filteredWords.value,
    (newFilteredItems) => {
      currentFilteredWords.value = newFilteredItems.results.map((item) => ({
        word: item.word,
        count: item.count,
        verses: item.verses,
      }))
      totalWordsCount.value = newFilteredItems.results.length
    },
    { immediate: true }
  )

  const onInput = (value) => {
    tarteel.value = value
    menu.value = true
    currentLetter.value = value[value.length - 1]
  }

  const setTarteelAllResults = () => {
    console.log(currentFilteredWords.value)
    tarteelStore.setStoredTarteels({
      inputText: tarteel.value,
      results: currentFilteredWords.value,
    })
    tarteelStore.addToTarteelHistory(tarteel.value)
    // menu.value = false
  }

  const onFocus = () => {
    menu.value = true
  }

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    menu.value = false
    currentFilteredWords.value = []
    totalWordsCount.value = 0
  }

  const updateEditableItems = (newItems) => {
    currentFilteredWords.value = newItems
  }

  return {
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
  }
}
