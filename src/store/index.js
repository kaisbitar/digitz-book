import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { fetchSuraDetails, fetchOneQuranFile, fetchtableQuranIndex } from '../api/api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    target: {
      fileName: '001الفاتحة',
      verseIndex: 1,
      suraNumber: 1
    },
    filteredSearch: [],
    filterSelectedIndex: 0,
    oneQuranFile: [],
    tableQuranIndex: [],
    suras: {},
    scrollTrigger: false,
    drawerState: true,
    numberInfoShow: true,
    activeTab: 'numberOfVerses',
    selectedInput: ''
  },
  plugins: [createPersistedState({ })],
  getters: {
    target: state => state.target,
    filteredSearch: state => state.filteredSearch,
    filterSelectedIndex: state => state.filterSelectedIndex,
    oneQuranFile: state => state.oneQuranFile,
    tableQuranIndex: state => state.tableQuranIndex,
    scrollTrigger: state => state.scrollTrigger,
    drawerState: state => state.drawerState,
    numberInfoShow: state => state.numberInfoShow,
    activeTab: state => state.activeTab,
    selectedInput: state => state.selectedInput

  },
  mutations: {
    setActiveTab (state, activeTab) {
      state.activeTab = activeTab
    },
    setNumberInfoShow (state, numberInfoShow) {
      state.numberInfoShow = numberInfoShow
    },
    setScrollTrigger (state) {
      state.scrollTrigger = false
    },
    setTarget (state, target) {
      var suraNumber = parseInt(target.fileName, 10)
      var value = { fileName: target.fileName, verseIndex: target.verseIndex, suraNumber: suraNumber }
      state.target = value
    },
    setFilterSelectedIndex (state, index) {
      state.filterSelectedIndex = index
    },
    resetFilterSelectedIndex (state) {
      state.filterSelectedIndex = 0
    },
    resetSuras (state) {
      state.suras = {}
    },
    setFilteredSearch (state, filteredSearch) {
      state.filteredSearch.push(filteredSearch)
    },
    resetFilteredItems (state) {
      state.filteredSearch = []
    },
    removeFilteredItem (state, index) {
      state.filteredSearch.splice(index, 1)
    },
    setoneQuranFile (state, items) {
      state.oneQuranFile = items
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
    },
    setSelectedInput (state, selectedInput) {
      state.selectedInput = selectedInput
    }
  },
  actions: {
    getQuranData ({ commit, state }) {
      if (state.oneQuranFile.length > 0) { return }
      const appApi = process.env.VUE_APP_API_URL
      fetchOneQuranFile(appApi).then((items) => {
        commit('setoneQuranFile', items)
      }).then(() => {
        fetchtableQuranIndex(appApi).then((data) => {
          commit('setTableQuranIndex', data)
        })
      })
    },
    getSuraDetails ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        var obj = { suraDetails: null }
        Vue.set(state.suras, state.target.fileName, obj)
      }
      return new Promise((resolve, reject) => {
        if (!state.suras[state.target.fileName].suraDetails) {
          const appApi = process.env.VUE_APP_API_URL
          fetchSuraDetails(appApi, state.target.fileName).then(suraDetails => {
            var obj = { suraDetails: suraDetails }
            commit('setSuraDetails', obj)
            resolve(suraDetails)
          })
          return
        }
        resolve(state.suras[state.target.fileName].suraDetails)
      })
    }
  }
})
