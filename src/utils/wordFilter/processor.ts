import { Results, VerseObject, FilterOptions } from './types'

// Pre-compiled tashkeel removal regex for reuse
const TASHKEEL_REGEX = /[\u064B-\u0652\u0670]/g

export const scoreWord = (word: string, search: string): number => {
  if (word.startsWith(search)) return 2
  if (word.includes(search)) return 1
  return 0
}

// Optimized word processor that avoids unnecessary object creation
export const processVerse = (
  verseObj: VerseObject,
  searchTerm: string,
  searchRegex: RegExp,
  results: Results,
  options: FilterOptions
): void => {
  const { verseText, fileName, verseIndex, verseNumberToQuran } = verseObj
  
  // Split words once
  const rawWords = verseText.split(/\s+/)
  const wordsLength = rawWords.length
  
  // Process each word
  for (let i = 0; i < wordsLength; i++) {
    const rawWord = rawWords[i]
    const word = options?.removeTashkeel 
      ? rawWord.replace(TASHKEEL_REGEX, "") 
      : rawWord
    
    // Reset regex lastIndex before each test (important for global regex)
    searchRegex.lastIndex = 0
    
    if (!searchRegex.test(word)) continue

    const score = scoreWord(word, searchTerm)
    
    if (!results[word]) {
      // Create new entry
      results[word] = {
        count: 1,
        score,
        verses: {
          [verseNumberToQuran]: {
            count: 1,
            verseId: verseNumberToQuran,
            fileName,
            verseIndex,
            verseNumberToQuran,
            verseText,
            suraName: fileName.replace(/[0-9]/g, "")
          }
        }
      }
      continue
    }
    
    // Update existing entry
    results[word].count++
    results[word].score = Math.max(results[word].score, score)
    
    if (!results[word].verses[verseNumberToQuran]) {
      results[word].verses[verseNumberToQuran] = {
        count: 1,
        verseId: verseNumberToQuran,
        fileName,
        verseIndex,
        verseNumberToQuran,
        verseText,
        suraName: fileName.replace(/[0-9]/g, "")
      }
      continue
    }
    
    results[word].verses[verseNumberToQuran].count++
  }
}
