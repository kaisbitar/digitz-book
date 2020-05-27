import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileName: '001الفاتحة',
    targetedVerse: null,
    searchedObject: {
      resultsCount: null,
      searchedString: null
    }
  },
  getters: {
    fileName: state => state.fileName,
    targetedVerse: state => state.targetedVerse,
    searchedObject: state => state.searchedObject
  },
  mutations: {
    setFileName (state, fileName) {
      state.fileName = fileName
    },
    setTargetedVerse (state, targetedVerse) {
      state.targetedVerse = targetedVerse
    },
    setSearchedObject (state, searchedObject) {
      state.searchedObject = searchedObject
    }
  },
  actions: {},
  modules: {}
})
