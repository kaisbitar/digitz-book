import { defineStore } from "pinia"
import { useStore } from "@/stores/appStore"

const store = useStore()

export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    storedTarteels: [],
    selectedTarteelIndex: null,
    tarteelHistory: [],
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
    getSelectedTarteel: (state) => {
      if (
        state.selectedTarteelIndex !== null &&
        state.storedTarteels.length > 0
      ) {
        return state.storedTarteels[state.selectedTarteelIndex]
      }
      return null
    },
    getTarteelHistory: (state) => state.tarteelHistory,
    getStoredTarteels: (state) => state.storedTarteels,
  },

  actions: {
    setStoredTarteels(results) {
      this.storedTarteels.push(results)
      // Automatically select the newly added tarteel
      this.setSelectedTarteelIndex(this.storedTarteels.length - 1)
    },
    setSelectedTarteelIndex(index) {
      if (index >= 0 && index < this.storedTarteels.length) {
        this.selectedTarteelIndex = index
      } else {
        this.selectedTarteelIndex = this.storedTarteels.length > 0 ? 0 : null
      }
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

    // Add this new action
    initializeStore() {
      if (
        this.storedTarteels.length > 0 &&
        this.selectedTarteelIndex === null
      ) {
        this.selectedTarteelIndex = 0
      }
    },
  },
})
