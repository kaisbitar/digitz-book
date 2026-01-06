export * from './types'
import { VerseObject, FilterResult, Results, FilterOptions } from './types'
import { generateStrictSearchRegex } from './regexGenerators'
import { processVerse } from './processor'
import { groupResults, formatResults } from './results'
import { getSuggestions } from './suggestions'

// Cache for compiled regex patterns
const regexCache = new Map<string, RegExp>()
const MAX_REGEX_CACHE_SIZE = 100

function getCachedRegex(search: string): RegExp {
  if (regexCache.has(search)) {
    return regexCache.get(search)!
  }
  
  if (regexCache.size >= MAX_REGEX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = regexCache.keys().next().value
    regexCache.delete(firstKey)
  }
  
  const regex = generateStrictSearchRegex(search)
  regexCache.set(search, regex)
  return regex
}

export function filterWords(
  searchTerm: string,
  oneQuranFile: VerseObject[],
  root?: string | null,
  options: FilterOptions = { removeTashkeel: true }
): FilterResult {
  // Use cached regex for better performance
  const searchRegex = getCachedRegex(searchTerm)
  const results: Results = {}

  // Use for loop instead of forEach for better performance
  const versesLength = oneQuranFile.length
  for (let i = 0; i < versesLength; i++) {
    processVerse(oneQuranFile[i], searchTerm, searchRegex, results, options)
  }

  // Only process root if it's different from search term and provided
  if (root && root !== searchTerm) {
    const rootRegex = getCachedRegex(root)
    for (let i = 0; i < versesLength; i++) {
      processVerse(oneQuranFile[i], root, rootRegex, results, options)
    }
  }

  const groupedResults = groupResults(results, searchTerm, root || undefined)
  const formattedResults = formatResults(groupedResults)

  // Only compute suggestions if no results found
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

  const length = oneQuranFile.length
  for (let i = 0; i < length; i++) {
    const item = oneQuranFile[i]
    const text = typeof item === "string" ? item : item.verseText
    const words = text.split(/\s+/)
    const wordsLength = words.length
    for (let j = 0; j < wordsLength; j++) {
      distinctWords.add(words[j])
    }
  }

  return distinctWords.size
}
