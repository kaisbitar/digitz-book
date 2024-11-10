import { useDataStore } from "../stores/dataStore"

// Add new calculation variations mapping
const calculationVariations = {
  ا: ["ا", "أ", "إ", "آ", "ٱ", "ء"],
  آ: ["ا"],
  إ: ["ا"],
  أ: ["ا"],
  ء: ["ا"],
  و: ["و", "ؤ"],
  ؤ: ["و"],
  ى: ["ى", "ي"],
  ي: ["ي", "ى", "ئ"],
  ه: ["ه", "ة"],
  ة: ["ه"],
}

const getCalculationVariations = (char) => {
  return calculationVariations[char] || [char]
}

export function useCounting() {
  const dataStore = useDataStore()
  const QuranLetters = computed(() => dataStore.getQuranLetterCounts)

  const calculateWordValue = (word) => {
    const letterRanking = Object.entries(QuranLetters.value)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [letter, _], index) => {
        acc[letter] = index + 1
        return acc
      }, {})

    return word.split("").reduce((sum, letter) => {
      const variations = getCalculationVariations(letter)
      const lowestRank = Math.min(
        ...variations.map(
          (variant) => letterRanking[variant] || Number.MAX_VALUE
        )
      )
      return sum + (lowestRank || 0)
    }, 0)
  }

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
    getCalculationVariations, // Export the helper function if needed elsewhere
  }
}
