import { defineStore } from "pinia"
import { useStore } from "@/stores/appStore"

const store = useStore()
export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    tarteelResults: [],
    selectedTarteelIndex: null,
    tarteelHistory: [],
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: "tarteel-store",
        storage: localStorage,
      },
    ],
  },

  getters: {
    getTarteelResults: (state) => state.tarteelResults,
    getSelectedTarteelIndex: (state) => state.selectedTarteelIndex,
    getSelectedTarteel: (state) =>
      state.tarteelResults[state.selectedTarteelIndex],
    getTarteelHistory: (state) => state.tarteelHistory,
  },

  actions: {
    setTarteelResults(results) {
      this.tarteelResults = results
    },
    setSelectedTarteelIndex(index) {
      this.selectedTarteelIndex = index
    },
    addToTarteelHistory(tarteelTerm) {
      if (!this.tarteelHistory.includes(tarteelTerm)) {
        this.tarteelHistory.unshift(tarteelTerm)
        this.tarteelHistory = this.tarteelHistory.slice(0, 10)
      }
    },
    clearTarteelHistory() {
      this.tarteelHistory = []
    },
    removeTarteelItem(index) {
      this.tarteelResults.splice(index, 1)
    },
  },
})
