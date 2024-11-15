import { defineStore } from "pinia"

export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    storedTarteels: [],
    selectedTarteelIndex: null,
    tarteelHistory: [],
    selectedRatl: null,
    selectedRatlIndex: null,
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
    getSelectedRatl: (state) => state.selectedRatl,
    getSelectedRatlIndex: (state) => state.selectedRatlIndex,
  },

  actions: {
    setStoredTarteels(results) {
      if (this.storedTarteels.length === 0) {
        this.selectedTarteelIndex = 0
        this.storedTarteels.push(results)
        return
      }
      this.selectedTarteelIndex++
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
      if (this.storedTarteels.length === 0) {
        this.selectedTarteelIndex = null
        this.selectedRatlIndex = null
        this.selectedRatl = null
        return
      }
      if (index > 0) {
        this.setSelectedTarteelIndex(index - 1)
        return
      }
      this.setSelectedTarteelIndex(0)
    },
    setSelectedRatl(ratl) {
      this.selectedRatl = ratl
    },
    setSelectedRatlIndex(index) {
      this.selectedRatlIndex = index
    },
    removeRatl(index) {
      this.storedTarteels[this.selectedTarteelIndex].results.splice(index, 1)
    },
  },
})
