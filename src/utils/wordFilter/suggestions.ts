import { VerseObject } from './types'
import { generateSuggestionRegex } from './regexGenerators'

// Cache for suggestion regex
const suggestionRegexCache = new Map<string, RegExp>()

function getCachedSuggestionRegex(search: string): RegExp {
  if (suggestionRegexCache.has(search)) {
    return suggestionRegexCache.get(search)!
  }
  
  // Limit cache size
  if (suggestionRegexCache.size >= 50) {
    const firstKey = suggestionRegexCache.keys().next().value
    suggestionRegexCache.delete(firstKey)
  }
  
  const regex = generateSuggestionRegex(search)
  suggestionRegexCache.set(search, regex)
  return regex
}

export const getSuggestions = (
  searchTerm: string,
  oneQuranFile: VerseObject[],
  maxSuggestions: number = 5
): string[] => {
  if (searchTerm.length < 2) return []

  const suggestionRegex = getCachedSuggestionRegex(searchTerm)
  const suggestions = new Set<string>()
  
  // Target: find enough unique suggestions quickly
  const targetSuggestions = maxSuggestions * 3 // Get more to allow for sorting
  
  const versesLength = oneQuranFile.length
  
  // Use for loop for better performance
  for (let i = 0; i < versesLength; i++) {
    const words = oneQuranFile[i].verseText.split(/\s+/)
    const wordsLength = words.length
    
    for (let j = 0; j < wordsLength; j++) {
      const word = words[j]
      // Reset lastIndex for global regex
      suggestionRegex.lastIndex = 0
      
      if (suggestionRegex.test(word)) {
        suggestions.add(word)
        
        // Early termination if we have enough suggestions
        if (suggestions.size >= targetSuggestions) {
          return Array.from(suggestions)
            .sort((a, b) => a.length - b.length)
            .slice(0, maxSuggestions)
        }
      }
    }
  }

  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length)
    .slice(0, maxSuggestions)
}
