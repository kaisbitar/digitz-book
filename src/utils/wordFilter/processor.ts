import { Results, VerseObject, FilterOptions } from './types'

export const processVerse = (
  verseObj: VerseObject,
  searchTerm: string,
  searchRegex: RegExp,
  results: Results,
  options: FilterOptions
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
  
    const createNewWordResult = () => ({
      count: 1,
      verses: {
        [verseNumberToQuran]: createVerseEntry()
      }
    })
  
    const updateExistingWord = (word: string) => {
      results[word].count++
      if (!results[word].verses[verseNumberToQuran]) {
        results[word].verses[verseNumberToQuran] = createVerseEntry()
        return
      }
      results[word].verses[verseNumberToQuran].count++
    }
  
    const words = verseText
      .split(/\s+/)
      .map(word => options?.removeTashkeel ? 
        word.replace(/[\u064B-\u0652\u0670]/g, "") : 
        word
      )

    words.forEach((word) => {
      if (!searchRegex.test(word)) return
      if (!results[word]) {
        results[word] = createNewWordResult()
        return
      }
      updateExistingWord(word)
    })
  } 
  