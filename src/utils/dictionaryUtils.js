import { fetchWordMeaning } from "@/api/api.js"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { removeTashkeel } from "@/utils/arabicUtils"

const store = useStore()
const dataStore = useDataStore()

// word -> root index, built once per allWordsRoots dataset (O(1) lookups)
let wordToRootIndex = null
let indexedRootsSource = null

const getWordToRootIndex = () => {
  const allWordsRoots = dataStore.allWordsRoots
  if (wordToRootIndex && indexedRootsSource === allWordsRoots) {
    return wordToRootIndex
  }

  const index = new Map()
  for (const rootObj of allWordsRoots) {
    if (!rootObj?.root) continue
    if (!index.has(rootObj.root)) index.set(rootObj.root, rootObj.root)
    if (!rootObj.words) continue
    for (const word of rootObj.words.split(/\s+/)) {
      if (word && !index.has(word)) index.set(word, rootObj.root)
    }
  }

  wordToRootIndex = index
  indexedRootsSource = allWordsRoots
  return index
}

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
  if (!word) return undefined

  return getWordToRootIndex().get(word)
}

export const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  let response = await fetchWordMeaning(appApi, wordRoot)
  const extractedMeaning = extractFromDictionnary(response[0])

  store.setWordMeaning({ word, meaning: extractedMeaning })
  return extractedMeaning
}
