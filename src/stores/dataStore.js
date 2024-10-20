import { defineStore } from "pinia"
import {
  fetchOneQuranFile,
  fetchtableQuranIndex,
  fetchAllVersesWithTashkeel,
} from "../api/api.js"
import { countLettersInQuran } from "@/utils/letterUtils"
import { countDistinctWords } from "@/utils/autoWordFilter"

export const useDataStore = defineStore("data", {
  state: () => ({
    oneQuranFile: [],
    QuranIndex: [],
    allVersesWithTashkeel: [],
    versesForCounting: [],
    letterCounts: {},
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
    getVersesForCounting: (state) => state.versesForCounting,
    getLetterCounts: (state) => state.letterCounts,
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
    setVersesForCounting(items) {
      this.versesForCounting = items
    },
    async getQuranData() {
      if (this.oneQuranFile.length > 0) return

      try {
        const appApi = import.meta.env.VITE_APP_API_URL

        // Fetch Quran file and index
        await this.fetchQuranFileAndIndex(appApi)
        // Fetch and process verses
        await this.fetchAndProcessVerses(appApi)
      } catch (error) {
        console.error("Error fetching Quran data:", error)
      }
    },

    async fetchAndProcessVerses(appApi) {
      const versesWithTashkeel = await fetchAllVersesWithTashkeel(appApi)

      if (!Array.isArray(versesWithTashkeel)) {
        console.error("versesWithTashkeel is not an array:", versesWithTashkeel)
        return
      }

      this.setAllVersesWithTashkeel(versesWithTashkeel)
      const versesForCounting = this.oneQuranFile.map(
        (verse) => verse.verseText
      )
      this.setVersesForCounting(versesForCounting)

      this.letterCounts = countLettersInQuran(versesForCounting.join(" "))
      this.totalWordsCount = countDistinctWords(versesForCounting)
      console.log(this.letterCounts)
    },

    async fetchQuranFileAndIndex(appApi) {
      const [QuranFile, tableIndex] = await Promise.all([
        fetchOneQuranFile(appApi),
        fetchtableQuranIndex(appApi),
      ])

      this.setOneQuranFile(QuranFile)
      this.setQuranIndex(tableIndex)
    },
  },
})
