import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName:'001الفاتحة',
  },
  getters: {
    fileName: state => state.fileName,
  },
  mutations: {
    setFileName(state, fileName){
      state.fileName = fileName
    }
  },
  actions: {},
  modules: {}
});
