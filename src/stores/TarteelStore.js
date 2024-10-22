import { defineStore } from "pinia"
import { useStore } from "@/stores/appStore"

const store = useStore()

export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    storedTarteels: [],
    selectedTarteelIndex: null,
    selectedTarteel: null,
    tarteelHistory: [],
    storedTarteels: [],
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        key: "tarteel",
        storage: localStorage,
      },
    ],
  },

  getters: {
    getSelectedTarteelIndex: (state) => state.selectedTarteelIndex,
    getSelectedTarteel: (state) =>
      state.storedTarteels[state.selectedTarteelIndex],
    getTarteelHistory: (state) => state.tarteelHistory,
    getStoredTarteels: (state) => state.storedTarteels,
  },

  actions: {
    setStoredTarteels(results) {
      this.storedTarteels.unshift(results)
    },
    setStoredTarteels(results) {
      this.storedTarteels.push(results)
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
      this.storedTarteels.splice(index, 1)
    },
  },
})
