import { defineStore } from "pinia"
import { filterItems } from "@/utils/autoWordFilter" // Assuming this utility exists
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    tarteelResults: [],
    selectedTarteelIndex: null,
    tarteelHistory: [],
    // Add any other tarteel-related state here
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
    // getSuggestedWords: (state) => (tarteelTerm) => {
    //   return filterItems(tarteelTerm, store.getAllVersesNoTashkeel)
    // },
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
        // Limit history to last 10 tarteel queries
        this.tarteelHistory = this.tarteelHistory.slice(0, 10)
      }
    },
    clearTarteelHistory() {
      this.tarteelHistory = []
    },
    removeTarteelItem(index) {
      this.tarteelResults.splice(index, 1)
    },
    // Add any other tarteel-related actions here
  },
})
