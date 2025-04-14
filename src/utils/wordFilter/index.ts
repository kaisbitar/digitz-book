export * from './types'
import { VerseObject, FilterResult, Results, FilterOptions } from './types'
import { generateStrictSearchRegex } from './regexGenerators'
import { processVerse } from './processor'
import { groupResults, formatResults } from './results'
import { getSuggestions } from './suggestions'

export function filterWords(
  searchTerm: string,
  oneQuranFile: VerseObject[],
  root?: string,
  options: FilterOptions = { removeTashkeel: false }
): FilterResult {
  const searchRegex = generateStrictSearchRegex(searchTerm)
  const results: Results = {}

  oneQuranFile.forEach((verseObj) => {
    processVerse(verseObj, searchTerm, searchRegex, results, options)
  })

  if (root && root !== searchTerm) {
    const rootRegex = generateStrictSearchRegex(root)
    oneQuranFile.forEach((verseObj) => {
      processVerse(verseObj, root, rootRegex, results, options)
    })
  }

  const groupedResults = groupResults(results, searchTerm, root)
  const formattedResults = formatResults(groupedResults)

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