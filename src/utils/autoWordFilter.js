// Helper function to generate Arabic character variations
const getCharVariations = (char) => {
  const variations = {
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
const generateSearchRegex = (search) => {
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
const scoreWord = (word, search) => {
  if (word.startsWith(search)) return 2
  if (word.includes(search)) return 1
  return 0
}

const processVerse = (verse, searchTerm, searchRegex, results) => {
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

const sortResults = (results) => {
  return Object.entries(results)
    .map(([word, { count, score, verses }]) => ({ word, count, score, verses }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.count !== a.count) return b.count - a.count
      return a.word.length - b.word.length
    })
}

const formatResults = (sortedResults, searchTerm) => {
  return {
    results: sortedResults.map(({ word, count, verses }) => ({
      word,
      count,
      verses: Object.keys(verses || []),
    })),
    totalCount: sortedResults.length,
  }
}

export function filterItems(searchTerm, quranArray) {
  const searchRegex = generateSearchRegex(searchTerm)
  const results = {}

  quranArray.forEach((verse) =>
    processVerse(verse, searchTerm, searchRegex, results)
  )

  const sortedResults = sortResults(results)
  return formatResults(sortedResults, searchTerm)
}
