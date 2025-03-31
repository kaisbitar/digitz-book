export * from './types'
import { VerseObject, FilterResult, Results } from './types'
import { generateStrictSearchRegex } from './regexGenerators'
import { processVerse } from './processor'
import { sortResults, formatResults } from './results'
import { getSuggestions } from './suggestions'

export function filterWords(
  searchTerm: string,
  oneQuranFile: VerseObject[]
): FilterResult {
  const searchRegex = generateStrictSearchRegex(searchTerm)
  const results: Results = {}

  oneQuranFile.forEach((verseObj) => {
    processVerse(verseObj, searchTerm, searchRegex, results)
  })
  
  const sortedResults = sortResults(results, searchTerm)
  const formattedResults = formatResults(sortedResults)

  if (formattedResults.results.length === 0) {
    return {
      ...formattedResults,
      suggestions: getSuggestions(searchTerm, oneQuranFile)
    }
  }


  return formattedResults
}

export function countDistinctWords(
  oneQuranFile: VerseObject[] | string[]
): number {
  const distinctWords = new Set<string>()

  oneQuranFile.forEach((item) => {
    const text = typeof item === "string" ? item : item.verseText
    const words = text.split(/\s+/)
    words.forEach((word) => {
      distinctWords.add(word)
    })
  })

  return distinctWords.size
} 