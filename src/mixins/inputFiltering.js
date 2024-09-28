import { ref, computed, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlightedText = ref("")

  const highlight = (text, search) => {
    if (!search) return text
    const regex = new RegExp(`(${search})`, "gi")
    return text
      .split(" ")
      .map((word) => {
        return `<span class="highlight-word" @mouseover="() => captureHoveredWord('${word}')">${word}</span>`
      })
      .join(" ")
  }

  const captureHoveredWord = (word) => {
    highlightedText.value = word // Store or handle the hovered word
    console.log(word) // Handle the hovered word as needed
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
