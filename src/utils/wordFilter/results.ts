import { Results, SortedResultItem, FilterResult } from './types'

export const groupResults = (
  results: Results,
  searchTerm: string,
  rootDerivatives: string[] = []
): SortedResultItem[] => {
  const exactMatches: SortedResultItem[] = []
  const rootDerivativeMatches: SortedResultItem[] = []
  const otherMatches: SortedResultItem[] = []

  const derivativesSet = new Set(rootDerivatives)

  // Helper function to check if a word is an exact match
  const isExactMatch = (word: string, pattern: string): boolean => {
    return word === pattern
  }

  Object.entries(results).forEach(([word, { count, verses }]) => {
    if (isExactMatch(word, searchTerm)) {
      exactMatches.push({ word, count, verses, group: 'exact' })
    } else if (derivativesSet.has(word)) {
      rootDerivativeMatches.push({ word, count, verses, group: 'root' })
    } else {
      otherMatches.push({ word, count, verses, group: 'other' })
    }
  })

  return [
    ...exactMatches,
    ...rootDerivativeMatches,
    ...otherMatches
  ]
}

export const formatResults = (sortedResults: SortedResultItem[]): FilterResult => {
    return {
        results: sortedResults.map(({ word, count, verses, group }) => {
          const uniqueSuraCount = new Set(
            Object.values(verses || {}).map(verse => verse.fileName)
          ).size

          const suras = new Set(
          Object.values(verses || {}).map(verse => verse.fileName.replace(/[0-9]/g, ""))
          )

          return {
            word,
            count,
            group,
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
