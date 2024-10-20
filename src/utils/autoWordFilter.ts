// Interfaces
interface CharVariations {
  [key: string]: string[]
}

interface ResultItem {
  count: number
  score: number
  verses: { [verse: string]: number }
}

interface Results {
  [word: string]: ResultItem
}

interface SortedResultItem {
  word: string
  count: number
  score: number
  verses: { [verse: string]: number }
}

interface FormattedResult {
  word: string
  count: number
  verses: string[]
}

interface FilterResult {
  results: FormattedResult[]
  totalCount: number
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
  results: Results
): void => {
  const words = verse.split(/\s+/)
  words.forEach((word) => {
    if (searchRegex.test(word)) {
      const score = scoreWord(word, searchTerm)
      if (results[word]) {
        results[word].count++
        results[word].score = Math.max(results[word].score, score)
        results[word].verses[verse] = (results[word].verses[verse] || 0) + 1
      } else {
        results[word] = { count: 1, score, verses: { [verse]: 1 } }
      }
    }
  })
}

const sortResults = (results: Results): SortedResultItem[] => {
  return Object.entries(results)
    .map(([word, { count, score, verses }]) => ({ word, count, score, verses }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.count !== a.count) return b.count - a.count
      return a.word.length - b.word.length
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
      verses: Object.keys(verses || []),
    })),
    totalCount: sortedResults.length,
  }
}

export function filterWords(
  searchTerm: string,
  quranArray: string[]
): FilterResult {
  const searchRegex = generateSearchRegex(searchTerm)
  const results: Results = {}

  quranArray.forEach((verse) => {
    processVerse(verse, searchTerm, searchRegex, results)
  })

  const sortedResults = sortResults(results)
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
