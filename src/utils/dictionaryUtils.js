import { fetchWordMeaning } from "@/api/api.js"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { removeTashkeel } from "@/utils/arabicUtils"

const store = useStore()
const dataStore = useDataStore()

// Simple cache to store word roots and avoid repeated expensive lookups
const rootCache = new Map()

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
  const wordRoot = await fetchWordRoot(word)
  await fetchWordMeaningData(word, wordRoot)
}

export const fetchWordRoot = async (word) => {
  const wordRoot = fetchWordRootDataFromStore(word)
  if (wordRoot) return wordRoot
  return null
}

export const fetchWordRootDataFromStore = (word) => {
  word = removeTashkeel(word)
  
  if (rootCache.has(word)) {
    return rootCache.get(word)
  }

  const allWordsRoots = dataStore.allWordsRoots
  
  // Escape regex special characters
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Regex to match whole word bounded by start/end of string or spaces
  const wordRegex = new RegExp(`(?:^| )${escapedWord}(?: |$)`)

  for (const rootObj of allWordsRoots) {
    // Check if the word matches the root itself
    if (word === rootObj.root) {
      rootCache.set(word, rootObj.root)
      return rootObj.root
    }

    // Optimization: Check if string includes word first (fast)
    // before doing the more expensive regex check
    if (rootObj.words.includes(word) && wordRegex.test(rootObj.words)) {
      rootCache.set(word, rootObj.root)
      return rootObj.root
    }
  }
  
  rootCache.set(word, undefined)
  return undefined
}

export const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  let response = await fetchWordMeaning(appApi, wordRoot)
  const extractedMeaning = extractFromDictionnary(response[0])

  store.setWordMeaning({ word, meaning: extractedMeaning })
  return extractedMeaning
}
