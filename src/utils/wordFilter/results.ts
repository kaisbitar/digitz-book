import { Results, SortedResultItem, FilterResult } from './types'

export const sortResults = (
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

export const formatResults = (sortedResults: SortedResultItem[]): FilterResult => {
    return {
        results: sortedResults.map(({ word, count, verses }) => {
          const uniqueSuraCount = new Set(
            Object.values(verses || {}).map(verse => verse.fileName)
          ).size

          return {
            word,
            count,
            uniqueSuraCount: uniqueSuraCount,
            verses: Object.entries(verses || []).map(
              ([key, { fileName, verseIndex, verseNumberToQuran, verseText }]) => ({
                fileName,
                verseIndex,
                verseNumberToQuran,
                verseText
              })
          ),
        }
      })
    }} 