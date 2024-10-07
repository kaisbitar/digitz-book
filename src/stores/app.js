// stores/store.js
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
    getVersesMobileView: (state) => {
      return state.versesMobileView
    },
    getFontSize: (state) => {
      return state.fontSize
    },
    getIsDialog: (state) => {
      return state.isDialog
    },
    getTarget: (state) => {
      return state.target
    },
    getResearchResults: (state) => {
      return state.researchResults
    },
    getSelectedSearchIndex: (state) => {
      return state.selectedSearchIndex
    },
    getOneQuranFile: (state) => {
      return state.oneQuranFile
    },
    getQuranIndex: (state) => {
      return state.QuranIndex
    },
    getDrawerState: (state) => {
      return state.drawerState
    },

    getActiveSuraTab: (state) => {
      return state.activeSuraTab
    },
    getActiveRoute: (state) => {
      return state.activeRoute
    },
    getChartFreqType: (state) => {
      return state.chartFreqType
    },
    getSelectedSearch: (state) => {
      return state.researchResults[state.selectedSearchIndex]
    },
    getAllVersesWithTashkeel: (state) => {
      return state.allVersesWithTashkeel
    },
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
      this.target = {
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

    // API Fetching Actions
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

    async getSuraDetails() {
      if (!this.suras[this.target.fileName]) {
        this.suras[this.target.fileName] = { suraDetails: null }
      }

      if (!this.suras[this.target.fileName].suraDetails) {
        const appApi = import.meta.env.VITE_APP_API_URL
        const suraDetails = await fetchSuraDetails(appApi, this.target.fileName)
        this.setSuraDetails({ suraDetails })
        return suraDetails
      }

      return this.suras[this.target.fileName].suraDetails
    },
  },
})
