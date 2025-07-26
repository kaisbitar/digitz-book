import { ref, computed } from "vue"
import { filterWords } from "@/utils/wordFilter"
import { useSearchTarteel } from "@/hooks/useSearchTarteel"
import { fetchWordRoot } from "@/utils/dictionaryUtils.js"
import { createArabicPattern } from "@/utils/arabicUtils"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const filteredList = ref([])
  const checkedItems = ref([])
  const suggestions = ref([])
  const includeTashkeel = ref(false)

  const currentWordsList = computed(() => filteredList.value)
  const totalWordsCount = computed(() => currentWordsList.value.length)
  const hasSuggestions = computed(() => suggestions.value.length > 0)

  const { setTarteel } = useSearchTarteel()

  const updateFilteredWords = async (word) => {
    const wordRoot = word.length >= 2 ? await fetchWordRoot(word) : null
    const wordSearchResults = filterWords(
      word,
      dataStore.getOneQuranFile,
      wordRoot,
      { removeTashkeel: !includeTashkeel.value }
    )
    if (wordSearchResults.suggestions) {
      suggestions.value = wordSearchResults.suggestions.map((suggestion) =>
        suggestion.replace(/[ًٌٍَُِّْ]/g, "")
      )
      filteredList.value = []
      return
    }
    suggestions.value = []
    filteredList.value = wordSearchResults.results.map((item) => ({
      ...item,
    }))
  }

  const updateFilteredVerses = (sentence) => {
    filteredList.value = []

    const pattern = createArabicPattern(sentence)
    const filteredVerses = dataStore.getOneQuranFile.filter((verse) => {
      if (verse.verseText.match(pattern)) {
        return {
          ...verse,
        }
      }
    })

    if (filteredVerses.length === 0) return (filteredList.value = [])

    filteredList.value = [
      {
        word: sentence,
        count: filteredVerses.length,
        verses: filteredVerses,
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

  const applySuggestion = (suggestedWord) => {
    tarteel.value = suggestedWord
    suggestions.value = []
    return handleInputChange(suggestedWord)
  }

  const debouncedSearch = debounce(async (value) => {
    if (value.length === 0) {
      currentLetter.value = value
      tarteel.value = value
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
    setTarteel(items, tarteel.value)
  }

  const updateCheckedItems = (newItems) => {
    checkedItems.value = newItems
  }

  const setTashkeelOption = (value) => {
    includeTashkeel.value = value
    if (tarteel.value) {
      handleInputChange(tarteel.value)
    }
  }

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

  return {
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
  }
}
