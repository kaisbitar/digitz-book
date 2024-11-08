import { useDataStore } from "../stores/dataStore"

export function useCounting() {
  const dataStore = useDataStore()
  const QuranLetters = computed(() => dataStore.getQuranLetterCounts)
  const countVerseWords = (verseText) => {
    if (verseText === "") return 0
    return verseText.split(" ").length
  }
  const countVerseLetters = (verseText) => {
    return verseText.replace(/ /g, "").length || 0
  }

  const countWordMatch = (search, data) => {
    if (!search || !data) return 0
    const searchString = search.trim()
    let count = 0
    data.forEach((item) => {
      const text = item.verseText
      const regex = new RegExp(searchString, "gi")
      const matches = text.match(regex)
      if (matches) {
        count += matches.length
      }
    })
    return count
  }

  const calculateWordValue = (word) => {
    // Create ordered array of letters by frequency
    const letterRanking = Object.entries(QuranLetters.value)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [letter, _], index) => {
        acc[letter] = index + 1
        return acc
      }, {})

    return word
      .split("")
      .reduce((sum, letter) => sum + (letterRanking[letter] || 0), 0)
  }

  const calculateVerseValue = (verseText) => {
    if (!verseText) return 0

    return verseText
      .split(" ")
      .reduce((sum, word) => sum + calculateWordValue(word), 0)
  }

  return {
    countWordMatch,
    countVerseWords,
    countVerseLetters,
    calculateWordValue,
    calculateVerseValue,
  }
}
