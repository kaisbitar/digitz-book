import { defineStore } from "pinia"

export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    storedTarteels: [],
    selectedTarteelId: null,
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
    getSelectedTarteelId: (state) => state.selectedTarteelId,
    getSelectedTarteel: (state) =>
      state.storedTarteels.find((t) => t.id === state.selectedTarteelId),
    getTarteelHistory: (state) => state.tarteelHistory,
    getStoredTarteels: (state) => state.storedTarteels,
    getSelectedRatl: (state) => state.selectedRatl,
    getSelectedRatlIndex: (state) => state.selectedRatlIndex,
    getTarteelTree: (state) => {
      const buildTree = (parentId) => {
        return state.storedTarteels
          .filter((t) => t.parentId === parentId)
          .map((tarteel) => ({
            ...tarteel,
            children: buildTree(tarteel.id),
          }))
      }

      return buildTree(null)
    },
  },

  actions: {
    setStoredTarteels(results) {
      if (this.storedTarteels.length === 0) {
        const rootTarteel = {
          id: Date.now(),
          parentId: null,
          inputText: results.inputText,
          results: results.results,
        }
        this.storedTarteels.push(rootTarteel)
        this.selectedTarteelId = rootTarteel.id
        return
      }

      const newTarteel = {
        id: Date.now(),
        parentId: this.getSelectedTarteel.id,
        inputText: results.inputText,
        results: results.results,
      }

      this.storedTarteels.push(newTarteel)
      this.selectedTarteelId = newTarteel.id
    },
    setSelectedTarteelId(id) {
      this.selectedTarteelId = id
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

    removeTarteelItem(id) {
      const index = this.storedTarteels.findIndex((t) => t.id === id)
      if (index === -1) return

      const removeRecursively = (targetId) => {
        const children = this.storedTarteels.filter(
          (t) => t.parentId === targetId
        )
        children.forEach((child) => removeRecursively(child.id))

        const itemIndex = this.storedTarteels.findIndex(
          (t) => t.id === targetId
        )
        if (itemIndex !== -1) {
          this.storedTarteels.splice(itemIndex, 1)
        }
      }

      removeRecursively(id)

      if (this.storedTarteels.length === 0) {
        this.selectedTarteelId = null
        this.selectedRatlIndex = null
        this.selectedRatl = null
        return
      }

      const parentId = this.storedTarteels.find((t) => t.id === id)?.parentId
      if (parentId) {
        this.setSelectedTarteelId(parentId)
      } else {
        this.setSelectedTarteelId(this.storedTarteels[0].id)
      }
    },
    setSelectedRatl(ratl) {
      this.selectedRatl = ratl
    },
    setSelectedRatlIndex(index) {
      this.selectedRatlIndex = index
    },
    removeRatl(index) {
      this.storedTarteels[this.selectedTarteelId].results.splice(index, 1)
    },
  },
})
