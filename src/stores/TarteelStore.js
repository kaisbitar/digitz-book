import { defineStore } from "pinia"

export const useTarteelStore = defineStore("tarteel", {
  state: () => ({
    storedTarteels: [],
    selectedTarteelId: null,
    tarteelHistory: [],
    selectedRatl: null,
    selectedRatlIndex: null,
    draftId: null,
    liveLetter: null,
    chartVisible: false,
    searchFocusTick: 0,
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

    // Live search: while the user types, one draft entry is updated in place.
    setLiveTarteel({ inputText, results, wordRoot = null }) {
      const draft = this.storedTarteels.find((t) => t.id === this.draftId)
      if (draft) {
        draft.inputText = inputText
        draft.results = results
        draft.wordRoot = wordRoot
      } else {
        const newDraft = {
          id: Date.now(),
          parentId: null,
          inputText,
          results,
          wordRoot,
        }
        this.storedTarteels.push(newDraft)
        this.draftId = newDraft.id
      }
      this.selectedTarteelId = this.draftId
      this.selectedRatl = results[0] ?? null
      this.selectedRatlIndex = results.length ? 0 : null
    },

    // The draft becomes a normal history entry. One row per searched word.
    commitDraft() {
      const draft = this.storedTarteels.find((t) => t.id === this.draftId)
      const key = (draft?.inputText || "").trim()
      if (draft && key) {
        this.storedTarteels = this.storedTarteels.filter(
          (item) => item.id === draft.id || (item.inputText || "").trim() !== key,
        )
      }
      this.draftId = null
    },

    setLiveLetter(letter) {
      this.liveLetter = letter
    },

    // Same as clicking the search box: focus it and show the chart + history
    requestSearchFocus() {
      this.searchFocusTick++
    },

    // True while the search box is focused with zero or one letter typed
    setChartVisible(value) {
      this.chartVisible = value
    },

    discardDraft() {
      if (!this.draftId) return
      this.removeTarteelItem(this.draftId)
      this.draftId = null
      const selected = this.getSelectedTarteel
      this.selectedRatl = selected?.results?.[0] ?? null
      this.selectedRatlIndex = selected ? 0 : null
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
      if (index !== -1) this.storedTarteels.splice(index, 1)
      if (this.selectedTarteelId === id)
        this.selectedTarteelId = this.storedTarteels[0]?.id || null
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
