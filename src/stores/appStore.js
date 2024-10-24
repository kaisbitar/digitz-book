import { defineStore } from "pinia"
import {
  fetchSuraDetails,
  fetchOneQuranFile,
  fetchtableQuranIndex,
  fetchAllVersesWithTashkeel,
} from "../api/api.js"

export const useStore = defineStore("Quran", {
  state: () => ({
    target: {
      suraNumber: "001",
      suraName: "الفاتحة",
      fileName: "001الفاتحة",
      verseIndex: 1,
      verseNumberToQuran: 1,
      tarteel: null,
    },
    suras: {},
    versesMobileView: false,
    activeSuraTab: "numberOfVerses",
    activeRoute: "search",
    chartFreqType: "words",
    isDialog: false,
    wordMeanings: {},
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: "AppStore",
        storage: localStorage,
      },
    ],
  },
  getters: {
    getVersesMobileView: (state) => state.versesMobileView,
    getIsDialog: (state) => state.isDialog,
    getTarget: (state) => state.target,
    getQuranIndex: (state) => state.QuranIndex,
    getActiveSuraTab: (state) => state.activeSuraTab,
    getActiveRoute: (state) => state.activeRoute,
    getChartFreqType: (state) => state.chartFreqType,
    getWordMeaning: (state) => (word) => state.wordMeanings[word] || null,
  },
  actions: {
    setVersesMobileView(state) {
      this.versesMobileView = state
    },

    setIsDialog(isDialog) {
      this.isDialog = isDialog
    },
    setChartFreqType(chartFreqType) {
      this.chartFreqType = chartFreqType
    },
    setActiveSuraTab(activeTab) {
      this.activeSuraTab = activeTab
    },
    setActiveRoute(activeRoute) {
      this.activeRoute = activeRoute
    },
    setTarget(target) {
      const suraNumber = target.fileName
        .replace(/[ء-٩]/g, "")
        .replace(/\s/g, "")
      const suraName = target.fileName.replace(/[0-9]/g, "")
      this.target = {
        suraNumber,
        suraName,
        fileName: target.fileName,
        verseIndex: target.verseIndex,
        verseNumberToQuran: target.verseNumberToQuran,
        tarteel: target.tarteel,
      }
    },
    resetTarget() {
      this.target = { fileName: "001الفاتحة", verseIndex: null }
    },
    setSearchIndex(index) {},
    resetSuras() {
      this.suras = {}
    },

    setRemoveSearchItem(index) {},
    setQuranIndex(items) {
      this.QuranIndex = items
    },
    setSuraDetails(suraDetails) {
      this.suras[this.target.fileName].suraDetails = suraDetails.suraDetails
    },
    setSuraChartData(suraChartData) {
      this.suras[this.target.fileName].suraChartData =
        suraChartData.suraChartData
    },
    setWordMeaning({ word, meaning }) {
      this.wordMeanings[word] = meaning
    },
  },
})
