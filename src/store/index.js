import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { fetchSuraText } from '../api/api.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    target: {
      fileName: '001الفاتحة',
      verseIndex: null,
      suraNumber: 1
    },
    filteredSearch: [],
    filterSelectedIndex: null,
    autoCompleteItems: [],
    quranIndex: [],
    suras: {},
    scrollTrigger: false
  },
  plugins: [createPersistedState()],
  getters: {
    target: state => state.target,
    filteredSearch: state => state.filteredSearch,
    filterSelectedIndex: state => state.filterSelectedIndex,
    autoCompleteItems: state => state.autoCompleteItems,
    quranIndex: state => state.quranIndex,
    scrollTrigger: state => state.scrollTrigger
  },
  mutations: {
    setScrollTrigger (state) {
      state.scrollTrigger = !state.scrollTrigger
    },
    setTarget (state, target) {
      var suraNumber = parseInt(target.fileName, 10)
      console.log(suraNumber)
      var value = { fileName: target.fileName, verseIndex: target.verseIndex, suraNumber: suraNumber }
      state.target = value
    },
    setFilterSelectedIndex (state, index) {
      state.filterSelectedIndex = index
    },
    resetFilterSelectedIndex (state) {
      state.filterSelectedIndex = null
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
    setQuranIndex (state, items) {
      state.quranIndex = items
    },
    setSura (state, singleSura) {
      Vue.set(state.suras, state.target.fileName, singleSura)
    }
  },
  actions: {
    getSura ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.suras[state.target.fileName]) {
          resolve(state.suras[state.target.fileName])
          return
        }
        const appApi = process.env.VUE_APP_API_URL
        fetchSuraText(appApi, state.target.fileName).then(singleSura => {
          commit('setSura', singleSura)
          resolve(singleSura)
        })
      })
    }
  },
  modules: {}
})
