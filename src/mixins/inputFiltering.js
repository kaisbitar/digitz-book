import { ref, computed, onMounted } from "vue"
import { useStore } from "@/stores/appStore"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlightedText = ref("")

  const highlight = (text, textToHighlight) => {
    if (!text) return
    if (!textToHighlight) return text
    text = text.toString()

    // Normalize text to remove tashkeel, including all diacritics
    const normalizeArabic = (str) => str.replace(/[\u064B-\u0652\u0670]/g, "")

    const normalizedText = normalizeArabic(text)
    const normalizedHighlight = normalizeArabic(textToHighlight)

    if (!normalizedHighlight) return text
    return normalizedText.replace(
      new RegExp(normalizedHighlight, "gi"),
      (match) => {
        return `<span class="highlight-match">${match}</span>`
      }
    )
  }

  const captureHoveredWord = (word) => {
    highlightedText.value = word
  }

  return {
    search,
    matchingStatus,
    updateSearchValue,
    highlight,
    captureHoveredWord,
  }
}
