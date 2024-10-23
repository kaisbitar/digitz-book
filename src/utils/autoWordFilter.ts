// Interfaces
interface CharVariations {
  [key: string]: string[]
}

interface ResultItem {
  count: number
  score: number
  verses: {
    [verse: string]: {
      count: number
      verseId: number
      fileName: string
      verseIndex: number
      verseNumberToQuran: number
    }
  }
}

interface Results {
  [word: string]: ResultItem
}

interface SortedResultItem {
  word: string
  count: number
  score: number
  verses: {
    [verse: string]: {
      count: number
      verseId: number
      fileName: string
      verseIndex: number
      verseNumberToQuran: number
    }
  }
}

interface FormattedResult {
  word: string
  count: number
  verses: {
    fileName: string
    verseIndex: number
    verseNumberToQuran: number
    verseText: string
  }[]
}

interface FilterResult {
  results: FormattedResult[]
}

interface VerseObject {
  fileName: string
  verseIndex: number
  verseNumberToQuran: number
  verseText: string
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
  verseObj: VerseObject,
  searchTerm: string,
  searchRegex: RegExp,
  results: Results
): void => {
  const { verseText, fileName, verseIndex, verseNumberToQuran } = verseObj

  const words = verseText.split(/\s+/)
  words.forEach((word) => {
    if (searchRegex.test(word)) {
      const score = scoreWord(word, searchTerm)
      if (results[word]) {
        results[word].count++
        results[word].score = Math.max(results[word].score, score)
        if (results[word].verses[verseText]) {
          results[word].verses[verseText].count++
        } else {
          results[word].verses[verseText] = {
            count: 1,
            verseId: verseNumberToQuran,
            fileName,
            verseIndex,
            verseNumberToQuran,
          }
        }
      } else {
        results[word] = {
          count: 1,
          score,
          verses: {
            [verseText]: {
              count: 1,
              verseId: verseNumberToQuran,
              fileName,
              verseIndex,
              verseNumberToQuran,
            },
          },
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

const formatResults = (sortedResults: SortedResultItem[]): FilterResult => {
  return {
    results: sortedResults.map(({ word, count, verses }) => ({
      word,
      count,
      verses: Object.entries(verses || []).map(
        ([verseText, { fileName, verseIndex, verseNumberToQuran }]) => ({
          fileName,
          verseIndex,
          verseNumberToQuran,
          verseText,
        })
      ),
    })),
  }
}

export function filterWords(
  searchTerm: string,
  oneQuranFile: VerseObject[]
): FilterResult {
  const searchRegex = generateSearchRegex(searchTerm)
  const results: Results = {}

  oneQuranFile.forEach((verseObj) => {
    processVerse(verseObj, searchTerm, searchRegex, results)
  })

  const sortedResults = sortResults(results, searchTerm)
  return formatResults(sortedResults)
}

// Update the countDistinctWords function
export function countDistinctWords(
  oneQuranFile: VerseObject[] | string[]
): number {
  const distinctWords = new Set<string>()

  oneQuranFile.forEach((item) => {
    const text = typeof item === "string" ? item : item.verseText
    const words = text.split(/\s+/)
    words.forEach((word) => {
      distinctWords.add(word)
    })
  })

  return distinctWords.size
}
