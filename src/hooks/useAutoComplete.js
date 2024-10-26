import { ref, computed } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const filteredWordsList = ref([])
  const checkedItems = ref([])

  const currentWordsList = computed(() => filteredWordsList.value)
  const totalWordsCount = computed(() => currentWordsList.value.length)

  const updateFilteredWords = () => {
    if (!tarteel.value) {
      filteredWordsList.value = []
      return
    }

    if (tarteel.value.length === 0) {
      filteredWordsList.value = []
      return
    }

    const filteredResults = filterWords(
      tarteel.value,
      dataStore.getOneQuranFile
    )
    filteredWordsList.value = filteredResults.results.map((item) => ({
      word: item.word,
      count: item.count,
      verses: item.verses,
    }))
  }

  const onInput = (value) => {
    if (!value) return

    tarteel.value = value
    menu.value = true
    currentLetter.value = value[value.length - 1]
    updateFilteredWords()
  }

  const onFocus = () => {
    menu.value = true
  }

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    menu.value = true
    filteredWordsList.value = []
  }

  const updateWordsList = (newItems) => {
    filteredWordsList.value = newItems
  }

  const storeTarteels = (items) => {
    tarteelStore.setStoredTarteels({
      inputText: tarteel.value,
      results: items,
    })
    tarteelStore.setSelectedRatlIndex(0)
    tarteelStore.setSelectedRatl(items[0])
    tarteelStore.addToTarteelHistory(tarteel.value)
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
