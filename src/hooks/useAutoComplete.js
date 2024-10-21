import { ref, computed, watch } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const currentTarteelResults = ref([])
  const totalWordsCount = ref(0)
  const filteredWords = computed(() => {
    if (!tarteel.value) {
      return { results: [], totalCount: 0 }
    }
    if (tarteel.value.length >= 0) {
      return filterWords(tarteel.value, dataStore.getVersesForCounting)
    }
    return { results: [], totalCount: 0 }
  })

  watch(
    () => filteredWords.value,
    (newFilteredItems) => {
      currentTarteelResults.value = newFilteredItems.results.map((item) => ({
        word: item.word,
        count: item.count,
      }))
      totalWordsCount.value = newFilteredItems.totalCount
    },
    { immediate: true }
  )

  const onInput = (value) => {
    tarteel.value = value
    if (value && value.length > 0) {
      menu.value = true
      currentLetter.value = value[value.length - 1]
    } else {
      menu.value = false
      currentLetter.value = ""
    }
  }

  const setTarteelAllResults = () => {
    tarteelStore.setTarteelResults({
      wordsVariantsCount: totalWordsCount.value,
      inputText: tarteel.value,
      verses: filteredWords.value.results,
    })
    tarteelStore.addToTarteelHistory(tarteel.value)
    menu.value = false
  }

  const onFocus = () => {
    menu.value = true
  }

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    menu.value = false
    currentTarteelResults.value = []
    totalWordsCount.value = 0
  }

  const updateEditableItems = (newItems) => {
    console.log(newItems)
    currentTarteelResults.value = newItems
  }

  const wordsVariantsCount = computed(() => {
    return totalWordsCount.value
  })

  return {
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
  }
}
