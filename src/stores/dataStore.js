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
  persist: {
    enabled: true,
    strategies: [
      {
        key: "quran-data-store",
        storage: localStorage,
      },
    ],
  },
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

      try {
        const appApi = import.meta.env.VITE_APP_API_URL

        await this.fetchQuranFileAndIndex(appApi)
        await this.fetchAndProcessVerses(appApi)
        await this.fetchAllWordsRoots(appApi)
        this.setDataVersion(import.meta.env.VITE_QURAN_DATA_VERSION)
      } catch (error) {
        console.error("Error fetching Quran data:", error)
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

    async fetchAllWordsRoots(appApi) {
      const allWordsRoots = await fetchAllWordsRoots(appApi)
      this.setAllWordsRoots(allWordsRoots)
    },
  },
})
