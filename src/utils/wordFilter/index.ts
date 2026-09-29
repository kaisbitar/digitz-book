export * from './types'
import { VerseObject, FilterResult, Results, FilterOptions } from './types'
import { generateStrictSearchRegex, generateWholeWordRegex } from './regexGenerators'
import { processVerse } from './processor'
import { groupResults, formatResults } from './results'
import { getSuggestions } from './suggestions'
import { useDataStore } from "@/stores/dataStore"

export function filterWords(
  searchTerm: string,
  oneQuranFile: VerseObject[],
  root?: string,
  options: FilterOptions = { removeTashkeel: true }
): FilterResult {
  const results: Results = {}
  
  // Get root derivatives before filtering
  let rootDerivatives: string[] = []
  if (root) {
    const dataStore = useDataStore()
    const allWordsRoots = dataStore.allWordsRoots
    
    if (allWordsRoots) {
      const rootEntry = Object.values(allWordsRoots).find((entry: any) => entry.root === root) as { root: string; words: string } | undefined
      if (rootEntry && rootEntry.words) {
        rootDerivatives = rootEntry.words.split(/\s+/)
      }
    }
  }

  // Compile every term once, then scan the Quran a single time.
  // What the user typed may be a partial word, so it matches anywhere in a word.
  // Root derivatives are complete words, so they must match a whole word;
  // otherwise short derivatives (e.g. "مال") match inside unrelated words.
  const uniqueDerivatives = Array.from(new Set(rootDerivatives)).filter(
    (derivative) => derivative && derivative !== searchTerm
  )
  const searchRegexes = [
    generateStrictSearchRegex(searchTerm),
    ...uniqueDerivatives.map(generateWholeWordRegex),
  ]

  for (const verseObj of oneQuranFile) {
    processVerse(verseObj, searchRegexes, results, options)
  }

  const groupedResults = groupResults(results, searchTerm, rootDerivatives)
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