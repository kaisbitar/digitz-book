// Interfaces
interface CharVariations {
  [key: string]: string[]
}

interface ResultItem {
  count: number
  score: number
  verses: { [verse: string]: { count: number; verseId: number } }
}

interface Results {
  [word: string]: ResultItem
}

interface SortedResultItem {
  word: string
  count: number
  score: number
  verses: { [verse: string]: { count: number; verseId: number } }
}

interface FormattedResult {
  word: string
  count: number
  verses: { verse: string; verseId: number }[]
}

interface FilterResult {
  results: FormattedResult[]
}

// Helper function to generate Arabic character variations
const getCharVariations = (char: string): string[] => {
  const variations: CharVariations = {
    ا: ["ا", "أ", "إ", "آ", "ٱ"],
    آ: ["آ", "ء", "ا"],
    ه: ["ه", "ة"],
    ت: ["ت", "ة"],
    ى: ["ى", "ي"],
    و: ["و", "ؤ"],
    ي: ["ي", "ئ", "ى"],
  }
  return variations[char] || [char]
}

// Generate regex pattern with possible variations
const generateSearchRegex = (search: string): RegExp => {
  const searchRegex = search
    .split("")
    .map((char) => {
      const variations = getCharVariations(char).join("")
      return `[${variations}]`
    })
    .join(".*?")
  return new RegExp(searchRegex, "g")
}

// Helper function to score a word based on its similarity to the search term
const scoreWord = (word: string, search: string): number => {
  if (word.startsWith(search)) return 2
  if (word.includes(search)) return 1
  return 0
}

const processVerse = (
  verse: string,
  searchTerm: string,
  searchRegex: RegExp,
  results: Results,
  verseId: number
): void => {
  const words = verse.split(/\s+/)
  words.forEach((word) => {
    if (searchRegex.test(word)) {
      const score = scoreWord(word, searchTerm)
      if (results[word]) {
        results[word].count++
        results[word].score = Math.max(results[word].score, score)
        if (results[word].verses[verse]) {
          results[word].verses[verse].count++
        } else {
          results[word].verses[verse] = { count: 1, verseId }
        }
      } else {
        results[word] = {
          count: 1,
          score,
          verses: { [verse]: { count: 1, verseId } },
        }
      }
    }
  })
}

const sortResults = (
  results: Results,
  searchTerm: string
): SortedResultItem[] => {
  return Object.entries(results)
    .map(([word, { count, score, verses }]) => ({ word, count, score, verses }))
    .sort((a, b) => {
      // Prioritize exact matches
      if (a.word === searchTerm && b.word !== searchTerm) return -1
      if (b.word === searchTerm && a.word !== searchTerm) return 1

      // Prioritize words starting with the search term
      const aStartsWith = a.word.startsWith(searchTerm)
      const bStartsWith = b.word.startsWith(searchTerm)
      if (aStartsWith && !bStartsWith) return -1
      if (bStartsWith && !aStartsWith) return 1

      // For words that both start with the search term, sort by length
      if (aStartsWith && bStartsWith) {
        return a.word.length - b.word.length
      }

      // For other words, use natural sort
      return a.word.localeCompare(b.word, "ar", {
        numeric: true,
        sensitivity: "base",
      })
    })
}

const formatResults = (
  sortedResults: SortedResultItem[],
  searchTerm: string
): FilterResult => {
  return {
    results: sortedResults.map(({ word, count, verses }) => ({
      word,
      count,
      verses: Object.entries(verses || []).map(([verse, { verseId }]) => ({
        verse,
        verseId: verseId + 1,
      })),
    })),
  }
}

export function filterWords(
  searchTerm: string,
  quranArray: string[]
): FilterResult {
  const searchRegex = generateSearchRegex(searchTerm)
  const results: Results = {}

  quranArray.forEach((verse, index) => {
    processVerse(verse, searchTerm, searchRegex, results, index)
  })

  const sortedResults = sortResults(results, searchTerm)
  return formatResults(sortedResults, searchTerm)
}

// New function to count distinct words in the Quran
export function countDistinctWords(quranArray: string[]): number {
  const distinctWords = new Set<string>()

  quranArray.forEach((verse) => {
    const words = verse.split(/\s+/)
    words.forEach((word) => {
      distinctWords.add(word)
    })
  })

  return distinctWords.size
}