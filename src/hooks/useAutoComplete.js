import { ref, computed } from "vue"
import { filterWords } from "@/utils/wordFilter"
import { useSearchTarteel } from "@/hooks/useSearchTarteel"
import { fetchWordRoot } from "@/utils/dictionaryUtils.js"
import { createArabicPattern } from "@/utils/arabicUtils"

const SUGGESTION_LIMIT = 200
const VERSE_SUGGESTION_LIMIT = 20000
let wordIndexFile = null
let plainIndex = []
let vocalizedIndex = []

// Strip vowels only. Keep the dagger alif so the suggestion stays the Quran spelling.
const normalizeWord = (word) => String(word || "").replace(/[\u064B-\u0652]/g, "")

const getWordIndex = (oneQuranFile) => {
  if (wordIndexFile === oneQuranFile) return

  const plainCounts = new Map()
  const vocalCounts = new Map()
  for (const verse of oneQuranFile || []) {
    for (const raw of String(verse.verseText || "").split(/\s+/)) {
      const plain = normalizeWord(raw)
      if (!plain) continue
      plainCounts.set(plain, (plainCounts.get(plain) || 0) + 1)
      vocalCounts.set(raw, (vocalCounts.get(raw) || 0) + 1)
    }
  }

  wordIndexFile = oneQuranFile
  plainIndex = [...plainCounts.entries()]
  vocalizedIndex = [...vocalCounts.entries()]
}

const suggestWords = (prefix, entries) => {
  const regex = new RegExp(`^${createArabicPattern(prefix).source}`)
  const matches = []

  for (const [word, count] of entries) {
    if (!regex.test(word)) continue
    matches.push({ word, count })
  }

  return matches
    .sort((a, b) => b.count - a.count || a.word.length - b.word.length)
    .slice(0, SUGGESTION_LIMIT)
    .map((item) => ({
      label: item.word,
      value: normalizeWord(item.word),
      count: item.count,
    }))
}

const normalizeVerse = (text) => normalizeWord(text).replace(/\s+/g, " ").trim()

const wordEdgeMatch = (text, match, partialEnd, exact) => {
  if (!match || match.index == null) return null
  const start = match.index
  if (exact && start > 0 && text[start - 1] !== " ") return null
  if (partialEnd) return match
  const end = start + match[0].length
  const afterOk = end === text.length || text[end] === " "
  if (!afterOk) return null
  return match
}

const EXTRA_WORDS = 4

const verseSnippet = (text, match, partialEnd, exact) => {
  const aligned = wordEdgeMatch(text, match, partialEnd, exact)
  if (!aligned) return null

  let wordStart = aligned.index
  while (wordStart > 0 && text[wordStart - 1] !== " ") wordStart--

  let end = aligned.index + aligned[0].length
  while (end < text.length && text[end] !== " ") end++

  const extra = text
    .slice(end)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, EXTRA_WORDS)

  const typedHead = text.slice(aligned.index, end).trim()
  const fullHead = text.slice(wordStart, end).trim()
  const tail = [typedHead, ...extra].filter(Boolean).join(" ")
  const value = [fullHead, ...extra].filter(Boolean).join(" ")
  const startsMidWord = wordStart < aligned.index

  return {
    label: startsMidWord ? `..${tail}` : value,
    value,
  }
}

const suggestVerses = (raw, file, exact) => {
  const trimmed = raw.trim()
  if (!trimmed) return []

  const partialEnd = !/\s$/.test(raw)
  const prefix = new RegExp(`^${createArabicPattern(trimmed).source}`)
  const inside = createArabicPattern(trimmed)
  const found = new Map()

  const push = (text, match) => {
    const snippet = verseSnippet(text, match, partialEnd, exact)
    if (!snippet) return
    const existing = found.get(snippet.value)
    if (existing) {
      existing.count += 1
      return
    }
    if (found.size >= VERSE_SUGGESTION_LIMIT) return
    found.set(snippet.value, { ...snippet, count: 1 })
  }

  const verses = []
  for (const verse of file || []) {
    const text = normalizeVerse(verse.verseText)
    if (!text) continue
    verses.push(text)
  }

  for (const text of verses) {
    const prefixMatch = text.match(prefix)
    if (prefixMatch) {
      push(text, prefixMatch)
      continue
    }
    push(text, text.match(inside))
  }

  return [...found.values()].sort((a, b) => b.count - a.count)
}

export function useAutoComplete(dataStore, tarteelStore) {
  const tarteel = ref("")
  const menu = ref(false)
  const currentLetter = ref("")
  const filteredList = ref([])
  const checkedItems = ref([])
  const suggestions = ref([])
  const includeTashkeel = ref(false)
  const exactVerseMatch = ref(true)

  const currentWordsList = computed(() => filteredList.value)
  const totalWordsCount = computed(() => currentWordsList.value.length)
  const hasSuggestions = computed(() => suggestions.value.length > 0)

  const menuSuggestions = computed(() => {
    const raw = tarteel.value || ""
    const text = raw.trim()
    if (!text) return []

    const file = dataStore.getOneQuranFile
    if (!file?.length) return []

    if (raw.includes(" "))
      return suggestVerses(raw, file, exactVerseMatch.value)

    getWordIndex(file)
    const entries = includeTashkeel.value ? vocalizedIndex : plainIndex
    return suggestWords(text, entries)
  })

  const { setTarteel } = useSearchTarteel()

  const updateFilteredWords = async (word) => {
    const wordRoot = word.length >= 2 ? await fetchWordRoot(word) : null
    const term = includeTashkeel.value ? normalizeWord(word) : word
    const wordSearchResults = filterWords(
      term,
      dataStore.getOneQuranFile,
      wordRoot,
      { removeTashkeel: !includeTashkeel.value },
    )
    if (wordSearchResults.suggestions) {
      suggestions.value = wordSearchResults.suggestions.map((suggestion) =>
        suggestion.replace(
          /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
          "",
        ),
      )
      filteredList.value = []
      return
    }

    suggestions.value = []
    filteredList.value = wordSearchResults.results.map((item) => ({
      ...item,
    }))
    filteredList.value.wordRoot = wordRoot
    filteredList.value.word = word
  }

  const matchesPhrase = (verseText, raw, exact) => {
    const sentence = raw.trim()
    if (!sentence) return false

    const partialEnd = !/\s$/.test(raw)
    const pattern = createArabicPattern(sentence, "g")

    for (const match of verseText.matchAll(pattern)) {
      if (!exact) return true
      const start = match.index
      if (start > 0 && verseText[start - 1] !== " ") continue
      if (partialEnd) return true
      const end = start + match[0].length
      if (end === verseText.length || verseText[end] === " ") return true
    }

    return false
  }

  const updateFilteredVerses = (raw) => {
    filteredList.value = []

    const sentence = raw.trim()
    const filteredVerses = dataStore.getOneQuranFile.filter((verse) =>
      matchesPhrase(verse.verseText, raw, exactVerseMatch.value),
    )

    if (filteredVerses.length === 0) return (filteredList.value = [])

    // Same shape as a word result so the phrase renders as a pill
    const suras = [
      ...new Set(
        filteredVerses.map((verse) => verse.fileName.replace(/[0-9]/g, "")),
      ),
    ]

    filteredList.value = [
      {
        word: sentence,
        exact: exactVerseMatch.value,
        count: filteredVerses.length,
        group: "exact",
        uniqueSuraCount: suras.length,
        suras,
        verses: filteredVerses.map(
          ({ fileName, verseIndex, verseNumberToQuran, verseText }) => ({
            fileName,
            verseIndex,
            verseNumberToQuran,
            verseText,
          }),
        ),
      },
    ]
    filteredList.value.word = sentence
    filteredList.value.wordRoot = null
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

    // If results is null, it means the search was cancelled by a newer one.
    // Return true to maintain "success" state while typing.
    if (results === null) return true

    return results
  }

  const applySuggestion = (suggestedWord) => {
    tarteel.value = suggestedWord
    suggestions.value = []
    return handleInputChange(suggestedWord)
  }

  const executeSearch = async (value) => {
    try {
      if (value.length === 0) {
        currentLetter.value = value
        tarteel.value = value
        return true
      }

      // A single letter only drives the letters chart, so skip the full scan.
      if (value.trim().length <= 1) {
        filteredList.value = []
        suggestions.value = []
        return true
      }

      if (!value.includes(" ")) {
        await updateFilteredWords(value)
        return filteredList.value.length > 0
      }

      updateFilteredVerses(value)
      return filteredList.value.length > 0
    } catch (error) {
      console.error("Error in search:", error)
      return false
    }
  }

  const debouncedSearch = debounce(executeSearch, 300)

  const searchNow = async (value) => {
    debouncedSearch.cancel()
    if (!value) {
      clearInput()
      return false
    }

    tarteel.value = value
    currentLetter.value = value[value.length - 1]
    return executeSearch(value)
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
    let prevResolve = null

    function executedFunction(...args) {
      if (prevResolve) prevResolve(null)

      return new Promise((resolve) => {
        prevResolve = resolve

        const later = async () => {
          timeout = null
          prevResolve = null
          const result = await func(...args)
          resolve(result)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      })
    }

    executedFunction.cancel = () => {
      clearTimeout(timeout)
      timeout = null
      if (!prevResolve) return
      prevResolve(null)
      prevResolve = null
    }

    return executedFunction
  }

  return {
    tarteel,
    menu,
    currentLetter,
    currentWordsList,
    totalWordsCount,
    checkedItems,
    suggestions,
    includeTashkeel,
    hasSuggestions,
    menuSuggestions,
    exactVerseMatch,
    handleInputChange,
    searchNow,
    toggleMenu,
    clearInput,
    updateFilteredList,
    storeTarteels,
    updateCheckedItems,
    applySuggestion,
    setTashkeelOption,
  }
}
