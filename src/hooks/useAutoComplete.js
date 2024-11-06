import { ref, computed, watchEffect, onUnmounted } from "vue"
import { filterWords } from "@/utils/autoWordFilter"

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    return new Promise((resolve) => {
      const later = async () => {
        clearTimeout(timeout)
        resolve(await func(...args))
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    })
  }
}

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

    if (filteredResults.length === 0) return (filteredList.value = [])

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

  const handleInputChange = async (value) => {
    if (!value) {
      clearInput()
      return false
    }

    tarteel.value = value
    currentLetter.value = value[value.length - 1]
    toggleMenu()

    const results = await debouncedSearch(value)
    return results
  }

  const debouncedSearch = debounce(async (value) => {
    if (value.length === 1) {
      currentLetter.value = value
      return true
    }

    if (!value.includes(" ")) {
      await updateFilteredWords(value)
      return filteredList.value.length > 0
    }

    await updateFilteredVerses(value)
    return filteredList.value.length > 0
  }, 300)

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
