import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { fetchSuraBasics, fetchSuraDetails, fetchSuraChartData, fetchSuraText, fetchVersesMap } from '../api/api.js'
// import { compress, decompress } from 'lzma'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    target: {
      fileName: '002البقرة',
      verseIndex: 0,
      suraNumber: 1
    },
    filteredSearch: [],
    filterSelectedIndex: 0,
    autoCompleteItems: [],
    tableQuranIndex: [],
    suras: {},
    scrollTrigger: false,
    drawerState: true,
    numberInfoShow: true
  },
  plugins: [createPersistedState({ })],
  getters: {
    target: state => state.target,
    filteredSearch: state => state.filteredSearch,
    filterSelectedIndex: state => state.filterSelectedIndex,
    autoCompleteItems: state => state.autoCompleteItems,
    tableQuranIndex: state => state.tableQuranIndex,
    scrollTrigger: state => state.scrollTrigger,
    drawerState: state => state.drawerState,
    numberInfoShow: state => state.numberInfoShow,
    versesMap: state => state.versesMap
  },
  mutations: {
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
    setAutoCompleteItems (state, items) {
      state.autoCompleteItems = items
    },
    settableQuranIndex (state, items) {
      state.tableQuranIndex = items
    },
    setDrawerState (state, drawerState) {
      state.drawerState = drawerState
    },
    setSuraBasics (state, suraBasics) {
      state.suras[state.target.fileName].suraBasics = suraBasics.suraBasics
    },
    setSuraText (state, suraText) {
      state.suras[state.target.fileName].suraText = suraText.suraText
    },
    setSuraDetails (state, suraDetails) {
      state.suras[state.target.fileName].suraDetails = suraDetails.suraDetails
    },
    setSuraChartData (state, suraChartData) {
      state.suras[state.target.fileName].suraChartData = suraChartData.suraChartData
    },
    setVersesMap (state, versesMap) {
      state.suras[state.target.fileName].versesMap = versesMap.versesMap
    }
  },
  actions: {
    checkLocalStorage () {
      for (var value in localStorage) {
        if (value.substr(0, 50) === 'vuex') {
          var valueLen = ((localStorage[value].length + value.length) * 2)
          var storedSize = (valueLen / 1024).toFixed(0)
        }
        if (storedSize < 9500) {
          return
        }
        this.commit('resetSuras')
        return
      }
    },
    getSuraText ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        var obj = { suraText: null }
        Vue.set(state.suras, state.target.fileName, obj)
      }
      return new Promise((resolve, reject) => {
        if (!state.suras[state.target.fileName].suraText) {
          const appApi = process.env.VUE_APP_API_URL
          fetchSuraText(appApi, state.target.fileName).then(suraText => {
            commit('setSuraText', suraText)
            resolve(state.suras[state.target.fileName].suraText)
          })
          return
        }
        resolve(state.suras[state.target.fileName].suraText)
      })
    },
    getSuraBasics ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        var obj = { suraBasics: null }
        Vue.set(state.suras, state.target.fileName, obj)
      }
      return new Promise((resolve, reject) => {
        if (!state.suras[state.target.fileName].suraBasics) {
          const appApi = process.env.VUE_APP_API_URL
          fetchSuraBasics(appApi, state.target.fileName).then(suraBasics => {
            var obj = { suraBasics: suraBasics }
            commit('setSuraBasics', obj)
            resolve(suraBasics)
          })
          return
        }
        resolve(state.suras[state.target.fileName].suraBasics)
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
    },
    getSuraChartData ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        var obj = { suraChartData: null }
        Vue.set(state.suras, state.target.fileName, obj)
      }
      return new Promise((resolve, reject) => {
        if (!state.suras[state.target.fileName].suraChartData) {
          const appApi = process.env.VUE_APP_API_URL
          fetchSuraChartData(appApi, state.target.fileName).then(suraChartData => {
            var obj = { suraChartData: suraChartData }
            commit('setSuraChartData', obj)
            resolve(suraChartData)
          })
          return
        }
        resolve(state.suras[state.target.fileName].suraChartData)
      })
    },
    getVersesMap ({ commit, state }) {
      if (!state.suras[state.target.fileName]) {
        var obj = { versesMap: null }
        Vue.set(state.suras, state.target.fileName, obj)
      }
      return new Promise((resolve, reject) => {
        if (!state.suras[state.target.fileName].versesMap) {
          const appApi = process.env.VUE_APP_API_URL
          fetchVersesMap(appApi, state.target.fileName).then(versesMap => {
            this.dispatch('checkLocalStorage')
            var obj = { versesMap: versesMap }
            commit('setVersesMap', obj)
            resolve(versesMap)
          })
          return
        }
        resolve(state.suras[state.target.fileName].versesMap)
      })
    }
  }
})
