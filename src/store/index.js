import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { fetchSuraDetails, fetchOneQuranFile, fetchtableQuranIndex, fetchAllVersesWithTashkeel } from '../api/api.js'

Vue.use(Vuex)
function initializeState () {
  return {
    target: {
      fileName: '001الفاتحة',
      verseIndex: 1
    },
    SearchResults: [],
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
    chartFreqType: 'words'
  }
}
export default new Vuex.Store({
  state: initializeState(),
  plugins: [createPersistedState({ })],
  getters: {
    target: state => state.target,
    SearchResults: state => state.SearchResults,
    selectedSearchIndex: state => state.selectedSearchIndex,
    oneQuranFile: state => state.oneQuranFile,
    allVersesWithTashkeel: state => state.allVersesWithTashkeel,
    tableQuranIndex: state => state.tableQuranIndex,
    scrollTrigger: state => state.scrollTrigger,
    drawerState: state => state.drawerState,
    activeView: state => state.activeView,
    activeTab: state => state.activeTab,
    chartFreqType: state => state.chartFreqType,
    selectedSearch: state => {
      return state.SearchResults[state.selectedSearchIndex]
    }
  },
  mutations: {
    clearState (state) {
      const initialState = initializeState()
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key]
      })
    },
    setChartFreqType (state, chartFreqType) {
      state.chartFreqType = chartFreqType
    },
    setActiveTab (state, activeTab) {
      state.activeTab = activeTab
    },
    setActiveView (state, activeView) {
      state.activeView = activeView
    },
    setScrollTrigger (state) {
      state.scrollTrigger = !state.scrollTrigger
    },
    setTarget (state, target) {
      state.target = { fileName: target.fileName, verseIndex: target.verseIndex }
    },
    resetTarget (state) {
      state.target = { fileName: '001الفاتحة', verseIndex: null }
    },
    setSearchIndex (state, index) {
      state.selectedSearchIndex = index
      state.selectedSearch = state.SearchResults[index]
    },
    resetSuras (state) {
      state.suras = {}
    },
    setSearchResultsItem (state, result) {
      state.SearchResults.push(result)
    },
    resetSearchResults (state) {
      state.SearchResults = []
    },
    removeSearchItem (state, index) {
      state.SearchResults.splice(index, 1)
    },
    setOneQuranFile (state, items) {
      state.oneQuranFile = items
    },
    setAllVersesWithTashkeel (state, items) {
      state.allVersesWithTashkeel = items
    },
    setTableQuranIndex (state, items) {
      state.tableQuranIndex = items
    },
    setDrawerState (state, drawerState) {
      state.drawerState = drawerState
    },
    setSuraDetails (state, suraDetails) {
      state.suras[state.target.fileName].suraDetails = suraDetails.suraDetails
    },
    setSuraChartData (state, suraChartData) {
      state.suras[state.target.fileName].suraChartData = suraChartData.suraChartData
    }
  },
  actions: {
    getQuranData ({ commit, state }) {
      if (state.oneQuranFile.length > 0) { return }
      const appApi = process.env.VUE_APP_API_URL
      fetchAllVersesWithTashkeel(appApi).then((items) => {
        commit('setAllVersesWithTashkeel', items)
      }).then(() => {
        fetchOneQuranFile(appApi).then((items) => {
          commit('setOneQuranFile', items)
        }).then(() => {
          fetchtableQuranIndex(appApi).then((data) => {
            commit('setTableQuranIndex', data)
          })
        })
      })
    },
    getSuraDetails ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        Vue.set(state.suras, state.target.fileName, { suraDetails: null })
      }
      return new Promise((resolve) => {
        if (!state.suras[state.target.fileName].suraDetails) {
          const appApi = process.env.VUE_APP_API_URL
          fetchSuraDetails(appApi, state.target.fileName).then(suraDetails => {
            commit('setSuraDetails', { suraDetails: suraDetails })
            resolve(suraDetails)
          })
          return
        }
        resolve(state.suras[state.target.fileName].suraDetails)
      })
    }
  }
})
