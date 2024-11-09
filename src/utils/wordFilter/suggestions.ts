import { VerseObject } from './types'
import { generateSuggestionRegex } from './regexGenerators'

export const getSuggestions = (
  searchTerm: string,
  oneQuranFile: VerseObject[],
  maxSuggestions: number = 5
): string[] => {
  if (searchTerm.length < 2) return []

  const suggestionRegex = generateSuggestionRegex(searchTerm)
  const suggestions = new Set<string>()

  for (const verseObj of oneQuranFile) {
    const words = verseObj.verseText.split(/\s+/)
    for (const word of words) {
      if (suggestionRegex.test(word)) {
        suggestions.add(word)
      }
    }
  }

  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length)
    .slice(0, maxSuggestions)
} 