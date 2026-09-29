import { Results, VerseObject, FilterOptions } from './types'

const TASHKEEL_REGEX = /[\u064B-\u0652\u0670]/g
const WHITESPACE_REGEX = /\s+/

export const processVerse = (
  verseObj: VerseObject,
  searchRegexes: RegExp[],
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

  const addMatch = (word: string) => {
    const existing = results[word]
    if (!existing) {
      results[word] = {
        count: 1,
        verses: { [verseNumberToQuran]: createVerseEntry() }
      }
      return
    }

    existing.count++
    const verseEntry = existing.verses[verseNumberToQuran]
    if (!verseEntry) {
      existing.verses[verseNumberToQuran] = createVerseEntry()
      return
    }
    verseEntry.count++
  }

  // Split and normalize each verse exactly once, then test every term.
  const rawWords = verseText.split(WHITESPACE_REGEX)
  for (const rawWord of rawWords) {
    const word = options?.removeTashkeel
      ? rawWord.replace(TASHKEEL_REGEX, "")
      : rawWord

    for (const regex of searchRegexes) {
      if (!regex.test(word)) continue
      addMatch(word)
      break
    }
  }
}
