import { ref } from "vue"
import { createArabicPattern } from "@/utils/arabicUtils"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlight = (text, textToHighlight) => {
    if (!text) return
    if (!textToHighlight) return text
    if (!textToHighlight.trim()) return text
    text = text.toString()

    // Same matching rules as the search (letter variations + tashkeel)
    return text.replace(
      createArabicPattern(textToHighlight, "g"),
      (match) => `<span class="highlight-match">${match}</span>`
    )
  }

  return {
    search,
    matchingStatus,
    updateSearchValue,
    highlight,
  }
}
