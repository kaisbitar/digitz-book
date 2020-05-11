import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName:'001الفاتحة',
    targetedVerse: null
  },
  getters: {
    fileName: state => state.fileName,
    targetedVerse: state => state.targetedVerse,
  },
  mutations: {
    setFileName(state, fileName){
      state.fileName = fileName
    },
    setTargetedVerse(state, targetedVerse){
      state.targetedVerse = targetedVerse
    }
  },
  actions: {},
  modules: {}
});
