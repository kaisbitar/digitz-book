import { Results, VerseObject } from './types'

export const scoreWord = (word: string, search: string): number => {
  if (word.startsWith(search)) return 2
  if (word.includes(search)) return 1
  return 0
}

export const processVerse = (
  verseObj: VerseObject,
  searchTerm: string,
  searchRegex: RegExp,
  results: Results
): void => {
    const { verseText, fileName, verseIndex, verseNumberToQuran } = verseObj

    const createVerseEntry = () => ({
      count: 1,
      verseId: verseNumberToQuran,
      fileName,
      verseIndex,
      verseNumberToQuran,
      verseText,
      suraName: fileName.replace(/[0-9]/g, "")
    })
  
    const createNewWordResult = (score: number) => ({
      count: 1,
      score,
      verses: {
        [verseNumberToQuran]: createVerseEntry()
      }
    })
  
    const updateExistingWord = (word: string, score: number) => {
      results[word].count++
      results[word].score = Math.max(results[word].score, score)
      
      if (!results[word].verses[verseNumberToQuran]) {
        results[word].verses[verseNumberToQuran] = createVerseEntry()
        return
      }
      
      results[word].verses[verseNumberToQuran].count++
    }
  
    const words = verseText.split(/\s+/)
    words.forEach((word) => {
      if (!searchRegex.test(word)) return
  
      const score = scoreWord(word, searchTerm)
      if (!results[word]) {
        results[word] = createNewWordResult(score)
        return
      }
  
      updateExistingWord(word, score)
    })} 