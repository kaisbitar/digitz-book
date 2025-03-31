import { defineStore } from "pinia"
import { useAuthStore } from "@/stores/authStore"

export const useStore = defineStore("Quran", {
  state: () => ({
    target: {
      suraNumber: "001",
      suraName: "الفاتحة",
      fileName: "001الفاتحة",
      verseIndex: 1,
      verseNumberToQuran: 1,
      verseText: null,
      tarteel: null,
    },
    suras: {},
    versesMobileView: false,
    activeSuraTab: "numberOfVerses",
    activeRoute: "search",
    chartFreqType: "words",
    wordMeanings: {},
    tarteelDrawer: true,
    indexDrawer: false,
    userPreferences: {
      theme: "light",
      fontSize: "medium",
    },
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: "AppStore",
        storage: localStorage,
      },
    ],
  },
  getters: {
    getVersesMobileView: (state) => state.versesMobileView,
    getTarget: (state) => state.target,
    getActiveSuraTab: (state) => state.activeSuraTab,
    getActiveRoute: (state) => state.activeRoute,
    getChartFreqType: (state) => state.chartFreqType,
    getWordMeaning: (state) => (word) => state.wordMeanings[word],
    getCurrentTheme: (state) => state.userPreferences.theme,
    getTarteelDrawer: (state) => state.tarteelDrawer,
    getIndexDrawer: (state) => state.indexDrawer,
  },
  actions: {
    setVersesMobileView(state) {
      this.versesMobileView = state
    },
    setChartFreqType(chartFreqType) {
      this.chartFreqType = chartFreqType
    },
    setActiveSuraTab(activeTab) {
      this.activeSuraTab = activeTab
    },
    setActiveRoute(activeRoute) {
      this.activeRoute = activeRoute
    },
    setTarget(target) {
      if (target.fileName !== "000المصحف") {
        this.target = {
          tarteel: target.tarteel,
          suraNumber: target.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, ""),
          suraName: target.fileName.replace(/[0-9]/g, ""),
          fileName: target.fileName,
          verseIndex: target.verseIndex,
          verseNumberToQuran: target.verseNumberToQuran,
          verseText: target.verseText,
          numberOfLetters: target.verseText.replace(/ /g, "").length,
          numberOfWords: target.verseText.split(" ").length,
          verseValue: target.verseValue,
        }
        return
      }
      this.target = {
        fileName: "000المصحف",
        suraNumber: "0",
        suraName: "المصحف",
        verseIndex: 1,
        verseNumberToQuran: 1,
        numberOfLetters: 324117,
        numberOfWords: 77432,
        verseText: "بسم الله الرحمن الرحيم",
        verseValue: 115,
      }
    },
    resetTarget() {
      this.target = { fileName: "001الفاتحة", verseIndex: null }
    },
    resetSuras() {
      this.suras = {}
    },

    setSuraDetails(suraDetails) {
      this.suras[this.target.fileName].suraDetails = suraDetails.suraDetails
    },
    setSuraChartData(suraChartData) {
      this.suras[this.target.fileName].suraChartData =
        suraChartData.suraChartData
    },
    setWordMeaning({ word, meaning }) {
      this.wordMeanings[word] = meaning
    },
    setTarteelDrawer(value) {
      this.tarteelDrawer = value
    },
    setIndexDrawer(value) {
      this.indexDrawer = value
    },
    async updatePreferences(preferences) {
      this.userPreferences = {
        ...this.userPreferences,
        ...preferences,
      }

      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          await authStore.updateUserSettings({
            preferences: this.userPreferences,
          })
        } catch (error) {
          console.error("Failed to sync preferences with database:", error)
        }
      }
    },
  },
})
