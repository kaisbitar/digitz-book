import { defineStore } from "pinia"
import {
  fetchOneQuranFile,
  fetchtableQuranIndex,
  fetchAllVersesWithTashkeel,
  fetchAllWordsRoots,
} from "../api/api.js"
import { countLettersInQuran } from "@/utils/letterUtils"
import { countDistinctWords } from "@/utils/wordFilter"

export const useDataStore = defineStore("data", {
  state: () => ({
    oneQuranFile: [],
    QuranIndex: [],
    allVersesWithTashkeel: [],
    QuranLetterCounts: {},
    totalWordsCount: 0,
    dataVersion: null,
    allWordsRoots: [],
  }),
  // The full Quran text is several MB — persisting it blows the mobile
  // localStorage quota. It is static cacheable data, so just refetch it.
  persist: false,
  getters: {
    getOneQuranFile: (state) => state.oneQuranFile,
    getQuranIndex: (state) => state.QuranIndex,
    getAllVersesWithTashkeel: (state) => state.allVersesWithTashkeel,
    getQuranLetterCounts: (state) => state.QuranLetterCounts,
    getDataVersion: (state) => state.dataVersion,
  },
  actions: {
    setOneQuranFile(items) {
      this.oneQuranFile = items
    },
    setQuranIndex(items) {
      this.QuranIndex = items
    },
    setAllVersesWithTashkeel(items) {
      this.allVersesWithTashkeel = items
    },
    setDataVersion(version) {
      this.dataVersion = version
    },
    setQuranLetterCounts(items) {
      this.QuranLetterCounts = items
    },
    setAllWordsRoots(items) {
      this.allWordsRoots = items
    },
    async getQuranData() {
      if (
        this.oneQuranFile.length > 0 &&
        this.dataVersion === import.meta.env.VITE_QURAN_DATA_VERSION
      ) {
        return
      }

      const appApi = import.meta.env.VITE_APP_API_URL

      // Mobile networks drop large requests often; retry with backoff
      // instead of leaving the app with no verse data.
      const RETRIES = 3
      for (let attempt = 1; attempt <= RETRIES; attempt++) {
        try {
          await this.fetchQuranFileAndIndex(appApi)
          await this.fetchAndProcessVerses(appApi)
          await this.fetchRoots(appApi)
          this.setDataVersion(import.meta.env.VITE_QURAN_DATA_VERSION)
          return
        } catch (error) {
          console.error(
            `Error fetching Quran data (attempt ${attempt}/${RETRIES}):`,
            error,
          )
          if (attempt < RETRIES) {
            await new Promise((r) => setTimeout(r, attempt * 2000))
          }
        }
      }
    },

    async fetchAndProcessVerses(appApi) {
      const versesWithTashkeel = await fetchAllVersesWithTashkeel(appApi)

      this.setAllVersesWithTashkeel(versesWithTashkeel)
      const versesForCounting = this.oneQuranFile.map((verse) =>
        verse.verseText.replace(
          /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
          ""
        )
      )

      this.QuranLetterCounts = countLettersInQuran(versesForCounting.join(" "))
      this.totalWordsCount = countDistinctWords(versesForCounting)
    },

    async fetchQuranFileAndIndex(appApi) {
      const [QuranFile, tableIndex] = await Promise.all([
        fetchOneQuranFile(appApi),
        fetchtableQuranIndex(appApi),
      ])

      this.setOneQuranFile(QuranFile)
      this.setQuranIndex(tableIndex)
    },

    async fetchRoots(appApi) {
      const allWordsRoots = await fetchAllWordsRoots(appApi)
      this.setAllWordsRoots(allWordsRoots)
    },
  },
})
