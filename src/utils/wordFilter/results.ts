import { Results, SortedResultItem, FilterResult } from './types'

export const groupResults = (
  results: Results,
  searchTerm: string,
  root?: string
): SortedResultItem[] => {
  const exactMatches: SortedResultItem[] = []
  const attachedMatches: SortedResultItem[] = []
  const rootMatches: SortedResultItem[] = []
  const otherMatches: SortedResultItem[] = []

  // Helper function to remove tashkeel
  const removeTashkeel = (word: string): string => {
    return word.replace(/[ًٌٍَُِّْ]/g, '')
  }

  // Helper function to remove ال from the beginning of a word
  const removeAl = (word: string): string => {
    return word.replace(/^ال/, '')
  }

  // List of allowed prefixes including compound ones
  const allowedPrefixes = [
    '', // no prefix
    'ال',
    'ب',
    'و',
    'ف',
    'بال',
    'وال',
    'فال',
    'لل',
    'ولل',
    'ن',
    'ت',
    'ي'
  ]

  // List of allowed suffixes
  const allowedSuffixes = [
    '', // no suffix
    // Pronouns
    'ا',
    'ه',
    'ها',
    'هم',
    'هن',
    'ك',
    'كم',
    'كن',
    'ي',
    'نا',
    // Dual/Plural
    'ان',
    'ين',
    'ون',
    'ات',
    // Feminine
    'ة',
    'اء',
    // Verb endings
    'ت',
    'وا',
    'تم',
    'تن'
  ]

  // Helper function to check if a word matches the pattern with prefixes and suffixes
  const hasAttachedPattern = (word: string, pattern: string): boolean => {
    const cleanWord = removeTashkeel(word)
    // Remove tashkeel and any leading ال from the pattern
    const cleanPattern = removeAl(removeTashkeel(pattern))
    
    // Check if the word matches pattern with any combination of allowed prefixes and suffixes
    return allowedPrefixes.some(prefix => {
      return allowedSuffixes.some(suffix => {
        const modifiedPattern = prefix + cleanPattern + suffix
        return cleanWord === modifiedPattern && (prefix !== '' || suffix !== '') // Exclude exact match
      })
    })
  }

  // Helper function to check if a word is an exact match
  const isExactMatch = (word: string, pattern: string): boolean => {
    const cleanWord = removeTashkeel(word)
    const cleanPattern = removeAl(removeTashkeel(pattern))
    return cleanWord === cleanPattern || cleanWord === 'ال' + cleanPattern
  }

  // Helper function to check if a word matches the root pattern
  const hasRootPattern = (word: string, rootPattern: string): boolean => {
    const cleanWord = removeTashkeel(word)
    const cleanRoot = removeTashkeel(rootPattern)
    
    // Check if the word contains the exact root sequence anywhere
    return cleanWord.includes(cleanRoot)
  }

  Object.entries(results).forEach(([word, { count, score, verses }]) => {
    if (isExactMatch(word, searchTerm)) {
      exactMatches.push({ word, count, score, verses, group: 'exact' })
    } else if (hasAttachedPattern(word, searchTerm)) {
      attachedMatches.push({ word, count, score, verses, group: 'attached' })
    } else if (root && hasRootPattern(word, root)) {
      rootMatches.push({ word, count, score, verses, group: 'root' })
    } else {
      otherMatches.push({ word, count, score, verses, group: 'other' })
    }
  })

  return [
    ...exactMatches,
    ...attachedMatches,
    ...rootMatches,
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
