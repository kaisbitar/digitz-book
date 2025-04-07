import { Results, SortedResultItem, FilterResult } from './types'

export const sortResults = (
  results: Results,
  searchTerm: string,
  root?: string
): SortedResultItem[] => {
    return Object.entries(results)
    .map(([word, { count, score, verses }]) => ({ word, count, score, verses }))
    .sort((a, b) => {
      // Prioritize exact matches with either searchTerm or root
      const aIsExactMatch = a.word === searchTerm || a.word === root
      const bIsExactMatch = b.word === searchTerm || b.word === root
      if (aIsExactMatch && !bIsExactMatch) return -1
      if (bIsExactMatch && !aIsExactMatch) return 1

      // Prioritize words starting with either searchTerm or root
      const aStartsWith = a.word.startsWith(searchTerm) || (root ? a.word.startsWith(root) : false)
      const bStartsWith = b.word.startsWith(searchTerm) || (root ? b.word.startsWith(root) : false)
      if (aStartsWith && !bStartsWith) return -1
      if (bStartsWith && !aStartsWith) return 1

      // For words that both start with searchTerm or root, sort by length
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

          const suras = new Set(
          Object.values(verses || {}).map(verse => verse.fileName.replace(/[0-9]/g, ""))
          )

          return {
            word,
            count,
            uniqueSuraCount: uniqueSuraCount,
            suras: Array.from(suras),
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