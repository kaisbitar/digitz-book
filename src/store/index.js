import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { fetchSuraDetails, fetchOneQuranFile, fetchtableQuranIndex, fetchAllVersesWithTashkeel } from '../api/api.js'

Vue.use(Vuex)
function initialState () {
  return {
    target: {
      fileName: '001الفاتحة',
      verseIndex: 1
    },
    filteredSearch: [],
    selectedSearchIndex: 0,
    oneQuranFile: [],
    tableQuranIndex: [],
    suras: {},
    scrollTrigger: false,
    drawerState: true,
    activeTab: 'numberOfVerses',
    activeView: 'suraChart',
    selectedSearch: [],
    updateDate: '04-18-2021'
  }
}
export default new Vuex.Store({
  state: initialState(),
  plugins: [createPersistedState({ })],
  getters: {
    target: state => state.target,
    filteredSearch: state => state.filteredSearch,
    selectedSearchIndex: state => state.selectedSearchIndex,
    oneQuranFile: state => state.oneQuranFile,
    allVersesWithTashkeel: state => state.allVersesWithTashkeel,
    tableQuranIndex: state => state.tableQuranIndex,
    scrollTrigger: state => state.scrollTrigger,
    drawerState: state => state.drawerState,
    activeView: state => state.activeView,
    activeTab: state => state.activeTab,
    selectedSearch: state => {
      var obj = {}
      state.filteredSearch.map((item) => {
        if (item.isSelected) obj = item
      })
      return obj
    }
  },
  mutations: {
    clearState (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
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
      var value = { fileName: target.fileName, verseIndex: target.verseIndex }
      state.target = value
    },
    resetTarget (state) {
      var value = { fileName: '001الفاتحة', verseIndex: null }
      state.target = value
    },
    setFilterSelectedIndex (state, index) {
      state.selectedSearchIndex = index
      state.filteredSearch.map((item, insideIndex) => {
        if (insideIndex === index) item.isSelected = true
        else { item.isSelected = false }
      })
    },
    setFilterSelectedSearch (state) {
      if (!state.filteredSearch[state.selectedSearchIndex]) return
      state.filteredSearch[state.selectedSearchIndex].isSelected = true
    },
    resetFilterSelectedSearch (state) {
      return state.filteredSearch.filter((item) => {
        item.isSelected = false
      })
    },
    resetFilterSelectedIndex (state) {
      state.selectedSearchIndex = 0
    },
    resetSuras (state) {
      state.suras = {}
    },
    setFilteredSearchItem (state, filteredSearch) {
      state.filteredSearch.map((item) => {
        item.isSelected = false
      })
      state.filteredSearch.push(filteredSearch)
    },
    addToAdvancedSearch (state, itemsToAdd) {
      state.filteredSearch.map((result, index) => {
        if (result.isSelected) {
          itemsToAdd.searchResults.map((item) => {
            state.filteredSearch[index].result.push(item)
          })
          // state.filteredSearch[index].resultsCount = state.filteredSearch[index].result.length
          var parentSearch = { text: itemsToAdd.search, result: itemsToAdd.searchResults.length }
          if (!state.filteredSearch[index].parentSearch) state.filteredSearch[index].parentSearch = []
          state.filteredSearch[index].parentSearch.push(parentSearch)
          // = '+ ' + itemsToAdd.search + ' ' + itemsToAdd.searchResults.length + ' آية '
        }
      })
    },
    deleteFromAdvancedSearch (state, verseNumberToQuran) {
      state.filteredSearch.map((result, index) => {
        if (result.isSelected) {
          console.log(verseNumberToQuran)
          state.filteredSearch[index].result =
          state.filteredSearch[index].result.filter((item) => {
            return item.verseNumberToQuran !== verseNumberToQuran
          })
          state.filteredSearch[index].resultsCount = state.filteredSearch[index].result.length
        }
      })
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
          commit('setoneQuranFile', items)
        }).then(() => {
          fetchtableQuranIndex(appApi).then((data) => {
            commit('setTableQuranIndex', data)
          })
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
