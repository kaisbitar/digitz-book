// stores/quranStore.js
import { defineStore } from 'pinia'
import {
  fetchSuraDetails,
  fetchOneQuranFile,
  fetchtableQuranIndex,
  fetchAllVersesWithTashkeel,
} from '../api/api.js'

export const useQuranStore = defineStore('quran', {
  state: () => ({
    target: {
      fileName: '001الفاتحة',
      verseIndex: 1,
    },
    searchResults: [], // Changed from SearchResults to camelCase
    selectedSearchIndex: 0,
    oneQuranFile: [],
    tableQuranIndex: [],
    suras: {},
    scrollTrigger: false,
    drawerState: true,
    activeTab: 'numberOfVerses',
    activeView: 'detailView',
    selectedSearch: [],
    updateDate: '04-18-2021',
    chartFreqType: 'words',
    allVersesWithTashkeel: [], // Added this missing state property
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'quran-store',
        storage: localStorage,
      },
    ],
  },
  getters: {
    getTarget: state => state.target,
    getSearchResults: state => state.searchResults,
    getSelectedSearchIndex: state => state.selectedSearchIndex,
    getOneQuranFile: state => state.oneQuranFile,
    getTableQuranIndex: state => state.tableQuranIndex,
    getScrollTrigger: state => state.scrollTrigger,
    getDrawerState: state => state.drawerState,
    getActiveView: state => state.activeView,
    getActiveTab: state => state.activeTab,
    getChartFreqType: state => state.chartFreqType,
    getSelectedSearch: state => state.searchResults[state.selectedSearchIndex],
    getAllVersesWithTashkeel: state => state.allVersesWithTashkeel,
  },
  actions: {
    setChartFreqType(chartFreqType) {
      this.chartFreqType = chartFreqType
    },
    setActiveTab(activeTab) {
      this.activeTab = activeTab
    },
    setActiveView(activeView) {
      this.activeView = activeView
    },
    toggleScrollTrigger() {
      this.scrollTrigger = !this.scrollTrigger
    },
    setTarget(target) {
      this.target = { fileName: target.fileName, verseIndex: target.verseIndex }
    },
    resetTarget() {
      this.target = { fileName: '001الفاتحة', verseIndex: null }
    },
    setSearchIndex(index) {
      this.selectedSearchIndex = index
      this.selectedSearch = this.SearchResults[index]
    },
    resetSuras() {
      this.suras = {}
    },
    setSearchResultsItem(result) {
      this.SearchResults.push(result)
    },
    resetSearchResults() {
      this.SearchResults = []
    },
    removeSearchItem(index) {
      this.SearchResults.splice(index, 1)
    },
    setOneQuranFile(items) {
      this.oneQuranFile = items
    },
    setAllVersesWithTashkeel(items) {
      this.allVersesWithTashkeel = items
    },
    setTableQuranIndex(items) {
      this.tableQuranIndex = items
    },
    setDrawerState(drawerState) {
      this.drawerState = drawerState
    },
    setSuraDetails(suraDetails) {
      this.suras[this.target.fileName].suraDetails = suraDetails.suraDetails
    },
    setSuraChartData(suraChartData) {
      this.suras[this.target.fileName].suraChartData = suraChartData.suraChartData
    },

    // API Fetching Actions
    async getQuranData() {
      if (this.oneQuranFile.length > 0) return

      const appApi = import.meta.env.VITE_APP_API_URL
      const versesWithTashkeel = await fetchAllVersesWithTashkeel(appApi)
      this.setAllVersesWithTashkeel(versesWithTashkeel)

      const quranFile = await fetchOneQuranFile(appApi)
      this.setOneQuranFile(quranFile)

      const tableIndex = await fetchtableQuranIndex(appApi)
      this.setTableQuranIndex(tableIndex)
    },

    async getSuraDetails() {
      if (!this.suras[this.target.fileName]) {
        this.suras[this.target.fileName] = { suraDetails: null }
      }

      if (!this.suras[this.target.fileName].suraDetails) {
        const appApi = import.meta.VUE_APP_API_URL
        const suraDetails = await fetchSuraDetails(appApi, this.target.fileName)
        this.setSuraDetails({ suraDetails })
        return suraDetails
      }

      return this.suras[this.target.fileName].suraDetails
    },
  },
})
