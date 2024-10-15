import { defineStore } from "pinia"
import {
  fetchSuraDetails,
  fetchOneQuranFile,
  fetchtableQuranIndex,
  fetchAllVersesWithTashkeel,
} from "../api/api.js"

export const useQuranStore = defineStore("Quran", {
  state: () => ({
    target: {
      suraNumber: "001",
      suraName: "الفاتحة",
      fileName: "001الفاتحة",
      verseIndex: 1,
      verseNumberToQuran: 1,
    },
    researchResults: [],
    selectedSearch: [],
    selectedSearchIndex: null,
    oneQuranFile: [],
    QuranIndex: [],
    suras: {},
    drawerState: false,
    versesMobileView: false,
    activeSuraTab: "numberOfVerses",
    activeRoute: "search",
    chartFreqType: "words",
    allVersesWithTashkeel: [],
    isDialog: false,
    fontSize: "19px",
    wordMeanings: {},
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: "Quran-store",
        storage: localStorage,
      },
    ],
  },
  getters: {
    getVersesMobileView: (state) => state.versesMobileView,
    getFontSize: (state) => state.fontSize,
    getIsDialog: (state) => state.isDialog,
    getTarget: (state) => state.target,
    getResearchResults: (state) => state.researchResults,
    getSelectedSearchIndex: (state) => state.selectedSearchIndex,
    getOneQuranFile: (state) => state.oneQuranFile,
    getQuranIndex: (state) => state.QuranIndex,
    getDrawerState: (state) => state.drawerState,
    getActiveSuraTab: (state) => state.activeSuraTab,
    getActiveRoute: (state) => state.activeRoute,
    getChartFreqType: (state) => state.chartFreqType,
    getSelectedSearch: (state) =>
      state.researchResults[state.selectedSearchIndex],
    getAllVersesWithTashkeel: (state) => state.allVersesWithTashkeel,
    getWordMeaning: (state) => (word) => state.wordMeanings[word] || null,
  },
  actions: {
    setVersesMobileView(state) {
      this.versesMobileView = state
    },
    setFontSize(state) {
      this.fontSize = state
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
      }
    },
    resetTarget() {
      this.target = { fileName: "001الفاتحة", verseIndex: null }
    },
    setSearchIndex(index) {
      this.selectedSearchIndex = index
      this.selectedSearch = this.researchResults[index]
    },
    resetSuras() {
      this.suras = {}
    },
    setResearchResults(result) {
      this.researchResults.push(result)
    },
    resetResearchResults() {
      this.researchResults = []
    },
    setRemoveSearchItem(index) {
      this.researchResults.splice(index, 1)
    },
    setOneQuranFile(items) {
      this.oneQuranFile = items
    },
    setAllVersesWithTashkeel(items) {
      this.allVersesWithTashkeel = items
    },
    setQuranIndex(items) {
      this.QuranIndex = items
    },
    setDrawerState(drawerState) {
      this.drawerState = drawerState
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
    async getQuranData() {
      if (this.oneQuranFile.length > 0) return

      const appApi = import.meta.env.VITE_APP_API_URL
      const versesWithTashkeel = await fetchAllVersesWithTashkeel(appApi)
      this.setAllVersesWithTashkeel(versesWithTashkeel)

      const QuranFile = await fetchOneQuranFile(appApi)
      this.setOneQuranFile(QuranFile)

      const tableIndex = await fetchtableQuranIndex(appApi)
      this.setQuranIndex(tableIndex)
    },

    // async getSuraDetails() {
    //   if (!this.suras[this.target.fileName]) {
    //     this.suras[this.target.fileName] = { suraDetails: null }
    //   }

    //   if (!this.suras[this.target.fileName].suraDetails) {
    //     const appApi = import.meta.env.VITE_APP_API_URL
    //     const suraDetails = await fetchSuraDetails(appApi, this.target.fileName)
    //     this.setSuraDetails({ suraDetails })
    //     return suraDetails
    //   }

    //   return this.suras[this.target.fileName].suraDetails
    // },
  },
})
