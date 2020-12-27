import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileName: '001الفاتحة',
    targetedVerse: null,
    searchedObject: [],
    filteredSearch: [],
    selectedSearch: 1,
    autoCompleteItems: []
  },
  plugins: [createPersistedState()],
  getters: {
    fileName: state => state.fileName,
    targetedVerse: state => state.targetedVerse,
    searchedObject: state => state.searchedObject,
    filteredSearch: state => state.filteredSearch,
    selectedSearch: state => state.selectedSearch,
    autoCompleteItems: state => state.autoCompleteItems
  },
  mutations: {
    setFileName (state, fileName) {
      state.fileName = fileName
    },
    setTargetedVerse (state, targetedVerse) {
      state.targetedVerse = targetedVerse
    },
    setSearchedObject (state, searchedObject) {
      state.searchedObject.push(searchedObject)
    },
    resetSearchedObject (state) {
      state.searchedObject = []
    },
    setSelectedSearch (state, index) {
      state.selectedSearch = index
    },
    removeSearchedItem (state, index) {
      if (index > -1) {
        state.searchedObject.splice(index, 1)
      }
    },
    setFilteredSearch (state, filteredSearch) {
      state.filteredSearch.push(filteredSearch)
    },
    removeFilteredItem (state, index) {
      state.filteredSearch.pop(index)
    },
    resetFilteredItems (state) {
      state.filteredSearch = []
    },
    setAutoCompleteItems (state, items) {
      state.autoCompleteItems = items
    }
  },
  actions: {},
  modules: {}
})
