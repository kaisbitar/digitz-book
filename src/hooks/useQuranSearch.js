import { filterWords } from "@/utils/autoWordFilter"

export function useQuranSearch(dataStore, tarteelStore) {
  const searchWord = async (word) => {
    // Use your existing filter logic
    const filteredResults = filterWords(word, dataStore.getOneQuranFile)
    const results = filteredResults.results.map((item) => ({
      word: item.word,
      count: item.count,
      verses: item.verses,
    }))

    // Store results using existing pattern
    tarteelStore.setStoredTarteels({
      inputText: word,
      results: results,
    })

    if (results.length > 0) {
      tarteelStore.setSelectedRatlIndex(0)
      tarteelStore.setSelectedRatl(results[0])
      tarteelStore.addToTarteelHistory(word)
    }

    return results.length > 0
  }

  return {
    searchWord,
  }
}
