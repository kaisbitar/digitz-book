import { ref, computed, watch } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const currentWordsList = ref([])
  const totalWordsCount = ref(0)
  const checkedItems = ref([])

  const filteredWords = computed(() => {
    if (!tarteel.value) {
      return { results: [] }
    }
    if (tarteel.value.length >= 0) {
      return filterWords(tarteel.value, dataStore.getOneQuranFile)
    }
    return { results: [] }
  })

  watch(
    () => filteredWords.value,
    (newFilteredItems) => {
      currentWordsList.value = newFilteredItems.results.map((item) => ({
        word: item.word,
        count: item.count,
        verses: item.verses,
      }))
      totalWordsCount.value = newFilteredItems.results.length
    },
    { immediate: true }
  )

  const onInput = (value) => {
    if (!value) return
    tarteel.value = value
    menu.value = true
    currentLetter.value = value[value.length - 1]
  }

  const storeTarteels = (items) => {
    tarteelStore.setStoredTarteels({
      inputText: tarteel.value,
      results: items,
    })
    tarteelStore.addToTarteelHistory(tarteel.value)
  }

  const onFocus = (value) => {
    menu.value = true
  }

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    menu.value = true
    currentWordsList.value = []
    totalWordsCount.value = 0
  }

  const updateWordsList = (newItems) => {
    currentWordsList.value = newItems
  }

  const updateCheckedItems = (newItems) => {
    checkedItems.value = newItems
  }

  return {
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
  }
}
