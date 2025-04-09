import { Results, SortedResultItem, FilterResult } from './types'

export const groupResults = (
  results: Results,
  searchTerm: string,
  root?: string
): SortedResultItem[] => {
  const exactMatches: SortedResultItem[] = []
  const rootMatches: SortedResultItem[] = []
  const derivativeMatches: SortedResultItem[] = []
  const otherMatches: SortedResultItem[] = []

  // Helper function to check if word has 3 letters in same order
  const hasThreeLettersInOrder = (word: string, target: string): boolean => {
    let targetIndex = 0
    let matchCount = 0
    
    for (let i = 0; i < word.length && targetIndex < target.length; i++) {
      if (word[i] === target[targetIndex]) {
        matchCount++
        targetIndex++
        if (matchCount === 3) return true
      }
    }
    return false
  }

  // Helper function to check if words share same letters
  const hasSameLetters = (word: string, target: string): boolean => {
    const wordLetters = word.split('').sort().join('')
    const targetLetters = target.split('').sort().join('')
    return wordLetters === targetLetters
  }

  Object.entries(results).forEach(([word, { count, score, verses }]) => {
    let group: 'exact' | 'root' | 'derivative' | 'other' = 'other'

    // 1. Exact matches
    if (word === searchTerm || word === root) {
      group = 'exact'
      exactMatches.push({ word, count, score, verses, group })
      return
    }

    // 2. Words sharing 3 letters with search term in same order
    if (hasThreeLettersInOrder(word, searchTerm)) {
      group = 'root'
      rootMatches.push({ word, count, score, verses, group })
      return
    }

    // 3. Words sharing 3 letters with root in same order
    if (root && hasThreeLettersInOrder(word, root)) {
      group = 'root'
      rootMatches.push({ word, count, score, verses, group })
      return
    }

    // 4. Words with same letters but different order
    if (hasSameLetters(word, searchTerm) || (root && hasSameLetters(word, root))) {
      group = 'derivative'
      derivativeMatches.push({ word, count, score, verses, group })
      return
    }

    // 5. Other matches
    otherMatches.push({ word, count, score, verses, group })
  })

  // Combine all groups in order
  return [
    ...exactMatches,
    ...rootMatches,
    ...derivativeMatches,
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
