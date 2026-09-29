import { fetchWordMeaning } from "@/api/api.js"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { removeTashkeel } from "@/utils/arabicUtils"

const store = useStore()
const dataStore = useDataStore()

// The Quran text writes many long alefs as a dagger-alef mark, so the stored
// spellings have no alef letter inside the word (e.g. "بأمولهم"). This folds a
// typed spelling ("بأموالهم", "بامولهم") onto the stored one.
const normalizeForLookup = (word) =>
  word
    .replace(/[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/[ئى]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ا/g, (match, offset) => (offset === 0 ? match : ""))

// word -> root indexes, built once per allWordsRoots dataset (O(1) lookups).
// `exact` uses the stored spelling; `normalized` is only a fallback.
let wordToRootIndex = null
let indexedRootsSource = null

const getWordToRootIndex = () => {
  const allWordsRoots = dataStore.allWordsRoots
  if (wordToRootIndex && indexedRootsSource === allWordsRoots) {
    return wordToRootIndex
  }

  const exact = new Map()
  const normalized = new Map()
  const add = (word, root) => {
    if (!exact.has(word)) exact.set(word, root)
    const key = normalizeForLookup(word)
    if (key && !normalized.has(key)) normalized.set(key, root)
  }

  for (const rootObj of allWordsRoots) {
    if (!rootObj?.root) continue
    add(rootObj.root, rootObj.root)
    if (!rootObj.words) continue
    for (const word of rootObj.words.split(/\s+/)) {
      if (word) add(word, rootObj.root)
    }
  }

  wordToRootIndex = { exact, normalized }
  indexedRootsSource = allWordsRoots
  return wordToRootIndex
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

  const { exact, normalized } = getWordToRootIndex()
  const exactRoot = exact.get(word)
  if (exactRoot) return exactRoot

  return normalized.get(normalizeForLookup(word))
}

export const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL
  let response = await fetchWordMeaning(appApi, wordRoot)
  const extractedMeaning = extractFromDictionnary(response[0])

  store.setWordMeaning({ word, meaning: extractedMeaning })
  return extractedMeaning
}
