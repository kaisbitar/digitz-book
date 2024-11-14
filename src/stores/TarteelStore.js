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
    getSelectedRatl: (state) => state.selectedRatl,
    getSelectedRatlIndex: (state) => state.selectedRatlIndex,
  },

  actions: {
    setStoredTarteels(results) {
      this.storedTarteels.push(results)
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
    initializeStore() {
      if (
        this.storedTarteels.length > 0 &&
        this.selectedTarteelIndex === null
      ) {
        this.selectedTarteelIndex = 0
      }
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
    removeRatl(index, searchIndex = 0) {
      if (searchIndex === 0) {
        this.storedTarteels[this.selectedTarteelIndex].results.splice(index, 1)
      } else {
        this.storedTarteels[this.selectedTarteelIndex].searches[
          searchIndex
        ].results.splice(index, 1)
      }
    },
    addToExistingTarteel(newSearch) {
      const currentTarteel = this.storedTarteels[this.selectedTarteelIndex]

      // Convert the current tarteel to array format if it's not already
      if (!Array.isArray(currentTarteel.searches)) {
        // Initialize the searches array with the original search
        currentTarteel.searches = [
          {
            inputText: currentTarteel.inputText,
            results: currentTarteel.results,
          },
        ]
      }

      // Add the new search
      currentTarteel.searches.push({
        inputText: newSearch.inputText,
        results: newSearch.results,
      })

      // Update the store
      this.storedTarteels[this.selectedTarteelIndex] = currentTarteel
    },
  },
})
