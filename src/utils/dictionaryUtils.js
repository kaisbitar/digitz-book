import { fetchWordMeaning, fetchWordRoot } from "@/api/api.js"
import { useStore } from "@/stores/appStore"

const store = useStore()

export const extractFromDictionnary = (allData) => {
  const lines = allData.split("\n")
  const results = []
  let currentWord = ""
  let currentMeaning = ""
  let currentDictionary = ""

  lines.forEach((line) => {
    line = line.trim()

    if (line && !line.includes("المعنى:") && !line.includes("المعجم:")) {
      if (currentWord === "") {
        currentWord = line
      }
    } else if (line.includes("المعنى:")) {
      currentMeaning = line.replace("المعنى:", "").trim()
    } else if (line.includes("المعجم:")) {
      currentDictionary = line.replace("المعجم:", "").trim()
    }

    if (currentWord && currentMeaning && currentDictionary) {
      results.push({
        word: currentWord,
        meaning: currentMeaning,
        dictionary: currentDictionary,
      })

      currentWord = ""
      currentMeaning = ""
      currentDictionary = ""
    }
  })

  return results
}

export const fetchWordData = async (word) => {
  const wordRoot = await fetchWordRootData(word)
  await fetchWordMeaningData(word, wordRoot)
}

export const fetchWordRootData = async (word) => {
  if (word.startsWith("ال")) return word
  try {
    const wordRootsApi = import.meta.env.VITE_WORD_ROOTS_API_URL
    const root = await fetchWordRoot(wordRootsApi, word)
    if (!root.words[0].root) return word
    if (root.words[0].root.includes("/")) {
      const cleanRoot = root.words[0].root.split("/")[0]
      return cleanRoot
    }
    return root.words[0].root
  } catch (error) {
    return word
  }
}

export const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  let response = await fetchWordMeaning(appApi, wordRoot)
  if (response.length === 0) {
    const modifiedWordRoot = wordRoot.slice(1, -2)
    response = await fetchWordMeaning(appApi, modifiedWordRoot)
  }
  const extractedMeaning = extractFromDictionnary(response[0])

  store.setWordMeaning({ word, meaning: extractedMeaning })
  return extractedMeaning // Return the meaning instead of updating component state
}

const hasThreeLettersInCommon = (word1, word2) => {
  const commonLetters = [...new Set(word1)].filter((letter) =>
    word2.includes(letter)
  )
  return commonLetters.length >= 2
}
