import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlightedText = ref("")

  const highlight = (text, textToHighlight) => {
    if (!text) return
    text = text.toString()
    if (!textToHighlight) return text
    return text.replace(new RegExp(textToHighlight, "gi"), (match) => {
      return `<span class="highlight-match">${match}</span>`
    })
  }

  const captureHoveredWord = (word) => {
    highlightedText.value = word
    console.log(word)
  }

  const handleIconEvent = (eventName) => {
    switch (eventName) {
      case "filter":
        changeMatchingStatus()
        break
      case "search":
        break
      default:
        console.warn(`Unhandled icon event: ${eventName}`)
    }
  }

  const changeMatchingStatus = (newMatchingStatus) => {
    console.log("changeMatchingStatus", newMatchingStatus)
  }

  return {
    search,
    matchingStatus,
    updateSearchValue,
    changeMatchingStatus,
    highlight,
    captureHoveredWord,
  }
}
