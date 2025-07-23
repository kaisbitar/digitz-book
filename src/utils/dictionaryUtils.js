import { fetchWordMeaning } from "@/api/api.js"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { removeTashkeel } from "@/utils/arabicUtils"

const store = useStore()
const dataStore = useDataStore()

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
  const wordRoot = fetchWordRootDataFromStore(word)
  if (wordRoot) return wordRoot
  return word
}

export const fetchWordRootDataFromStore = (word) => {
  word = removeTashkeel(word)
  const allWordsRoots = dataStore.allWordsRoots
  for (const rootObj of allWordsRoots) {
    if (rootObj.words && rootObj.words.split(" ").includes(word)) {
      return rootObj.root
    }
  }
  return undefined
}

export const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  let response = await fetchWordMeaning(appApi, wordRoot)
  const extractedMeaning = extractFromDictionnary(response[0])

  store.setWordMeaning({ word, meaning: extractedMeaning })
  return extractedMeaning
}
