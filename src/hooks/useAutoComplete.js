import { ref, computed } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const filteredList = ref([])
  const checkedItems = ref([])

  const currentWordsList = computed(() => filteredList.value)
  const totalWordsCount = computed(() => currentWordsList.value.length)

  const updateFilteredWords = (word) => {
    const filteredResults = filterWords(word, dataStore.getOneQuranFile)
    filteredList.value = filteredResults.results.map((item) => ({
      word: item.word,
      count: item.count,
      verses: item.verses,
    }))
  }

  const updateFilteredVerses = (sentence) => {
    filteredList.value = []
    const filteredResults = dataStore.getOneQuranFile.filter((verse) => {
      if (verse.verseText.includes(sentence)) {
        return {
          ...verse,
        }
      }
    })
    if (filteredResults.length === 0) {
      filteredList.value = []
      return
    }
    filteredList.value = [
      {
        word: sentence,
        count: filteredResults.length,
        verses: filteredResults,
      },
    ]
  }

  const toggleMenu = (isOpen = true) => {
    menu.value = isOpen
  }

  const handleInputChange = (value, isBackspacing = false) => {
    if (!value) {
      clearInput()
      return
    }

    if (isBackspacing && value.length === 1) {
      tarteel.value = tarteel.value.slice(0, -1)
      currentLetter.value = value[value.length - 1]

      return
    }

    tarteel.value = value
    currentLetter.value = value[value.length - 1]
    toggleMenu()

    if (!value.includes(" ") && value.length > 1) {
      updateFilteredWords(value)
    } else {
      updateFilteredVerses(value)
    }

    return filteredList.value.length > 0
  }

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    filteredList.value = []
    toggleMenu()
  }

  const updateFilteredList = (newItems) => {
    filteredList.value = newItems
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
    handleInputChange,
    toggleMenu,
    clearInput,
    updateFilteredList,
    storeTarteels,
    updateCheckedItems,
  }
}
