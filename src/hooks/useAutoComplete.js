import { ref, computed } from "vue"
import { filterWords } from "@/utils/wordFilter"
import { useSearchTarteel } from "@/hooks/useSearchTarteel"
import { fetchWordRootData } from "@/utils/dictionaryUtils.js"
import { createArabicPattern } from "@/utils/arabicUtils"

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const filteredList = ref([])
  const checkedItems = ref([])
  const suggestions = ref([])
  const includeTashkeel = ref(false)
  const isLoading = ref(false)
  
  // Track the latest search request to prevent race conditions
  let searchRequestId = 0
  
  // Cache for search results to avoid redundant processing
  const searchCache = new Map()
  const MAX_CACHE_SIZE = 50

  const currentWordsList = computed(() => filteredList.value)
  const totalWordsCount = computed(() => currentWordsList.value.length)
  const hasSuggestions = computed(() => suggestions.value.length > 0)

  const { setTarteel } = useSearchTarteel()

  // Helper to manage cache size
  const addToCache = (key, value) => {
    if (searchCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = searchCache.keys().next().value
      searchCache.delete(firstKey)
    }
    searchCache.set(key, value)
  }

  // Get cache key based on search parameters
  const getCacheKey = (word, withTashkeel) => `${word}:${withTashkeel}`

  const updateFilteredWords = async (word, requestId) => {
    const cacheKey = getCacheKey(word, !includeTashkeel.value)
    
    // Check cache first for instant results
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey)
      if (requestId !== searchRequestId) return
      
      if (cached.suggestions) {
        suggestions.value = cached.suggestions
        filteredList.value = []
      } else {
        suggestions.value = []
        filteredList.value = cached.results
      }
      return
    }
    
    // First, show results WITHOUT root lookup for instant feedback
    const wordSearchResults = filterWords(
      word,
      dataStore.getOneQuranFile,
      null, // Skip root for initial fast results
      { removeTashkeel: !includeTashkeel.value }
    )
    
    // Check if this request is still the latest one
    if (requestId !== searchRequestId) return
    
    if (wordSearchResults.suggestions) {
      const cleanSuggestions = wordSearchResults.suggestions.map((suggestion) =>
        suggestion.replace(/[ًٌٍَُِّْ]/g, "")
      )
      suggestions.value = cleanSuggestions
      filteredList.value = []
      
      // Cache the suggestions
      addToCache(cacheKey, { suggestions: cleanSuggestions })
      return
    }

    suggestions.value = []
    const results = wordSearchResults.results.map((item) => ({
      ...item,
    }))
    filteredList.value = results
    
    // Cache the initial results
    addToCache(cacheKey, { results })
    
    // Now fetch root data in background for enhanced results (non-blocking)
    if (word.length > 3) {
      enhanceWithRootResults(word, requestId, results, cacheKey)
    }
  }
  
  // Background enhancement with root data - doesn't block initial results
  const enhanceWithRootResults = async (word, requestId, currentResults, cacheKey) => {
    try {
      const wordRoot = await fetchWordRootData(word)
      
      // Check if request is still valid
      if (requestId !== searchRequestId) return
      if (!wordRoot || wordRoot === word) return
      
      // Re-run filter with root for enhanced results
      const enhancedResults = filterWords(
        word,
        dataStore.getOneQuranFile,
        wordRoot,
        { removeTashkeel: !includeTashkeel.value }
      )
      
      // Check again after processing
      if (requestId !== searchRequestId) return
      
      if (!enhancedResults.suggestions && enhancedResults.results.length > currentResults.length) {
        const results = enhancedResults.results.map((item) => ({
          ...item,
        }))
        filteredList.value = results
        
        // Update cache with enhanced results
        addToCache(cacheKey, { results })
      }
    } catch (error) {
      // Silently fail - we already have results
      console.debug("Root enhancement failed:", error)
    }
  }

  const updateFilteredVerses = (sentence, requestId) => {
    // Early return if this request is stale
    if (requestId !== searchRequestId) return
    
    const cacheKey = `verse:${sentence}`
    
    // Check cache first
    if (searchCache.has(cacheKey)) {
      if (requestId !== searchRequestId) return
      filteredList.value = searchCache.get(cacheKey)
      return
    }
    
    filteredList.value = []

    const pattern = createArabicPattern(sentence)
    const filteredVerses = []
    const verses = dataStore.getOneQuranFile
    
    // Use for loop for better performance and early termination
    for (let i = 0; i < verses.length; i++) {
      const verse = verses[i]
      if (verse.verseText.match(pattern)) {
        filteredVerses.push({
          ...verse,
        })
      }
      
      // Check periodically if request is stale (every 500 verses)
      if (i % 500 === 0 && requestId !== searchRequestId) return
    }

    // Check again after filtering
    if (requestId !== searchRequestId) return

    if (filteredVerses.length === 0) {
      filteredList.value = []
      addToCache(cacheKey, [])
      return
    }

    const result = [
      {
        word: sentence,
        count: filteredVerses.length,
        verses: filteredVerses,
      },
    ]
    
    filteredList.value = result
    addToCache(cacheKey, result)
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
    // Increment and capture the current request ID
    const currentRequestId = ++searchRequestId
    
    if (value.length === 0) {
      currentLetter.value = value
      tarteel.value = value
      return true
    }
    
    isLoading.value = true

    try {
      if (!value.includes(" ")) {
        await updateFilteredWords(value, currentRequestId)
        // Only return results if this is still the latest request
        return currentRequestId === searchRequestId && filteredList.value.length > 0
      }

      await updateFilteredVerses(value, currentRequestId)
      // Only return results if this is still the latest request
      return currentRequestId === searchRequestId && filteredList.value.length > 0
    } finally {
      if (currentRequestId === searchRequestId) {
        isLoading.value = false
      }
    }
  }, 150) // Reduced debounce time since search is now faster

  const clearInput = () => {
    tarteel.value = ""
    currentLetter.value = ""
    filteredList.value = []
    suggestions.value = []
    // Increment searchRequestId to cancel any pending operations
    searchRequestId++
    isLoading.value = false
    toggleMenu()
  }
  
  // Clear cache when needed (e.g., when tashkeel option changes)
  const clearCache = () => {
    searchCache.clear()
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
    clearCache() // Clear cache when option changes
    if (tarteel.value) {
      handleInputChange(tarteel.value)
    }
  }

  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      // Clear any pending timeout to prevent execution of stale requests
      if (timeout) {
        clearTimeout(timeout)
      }
      
      return new Promise((resolve) => {
        timeout = setTimeout(async () => {
          timeout = null
          resolve(await func(...args))
        }, wait)
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
    isLoading,
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
