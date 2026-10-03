import { ref } from "vue"
import { createArabicPattern } from "@/utils/arabicUtils"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlight = (text, textToHighlight, exact = false) => {
    if (!text) return
    if (!textToHighlight) return text
    if (!textToHighlight.trim()) return text
    text = text.toString()

    const partialEnd = !/\s$/.test(textToHighlight)
    const wrap = (match) => `<span class="highlight-match">${match}</span>`

    return text.replace(
      createArabicPattern(textToHighlight.trim(), "g"),
      (match, offset) => {
        if (!exact) return wrap(match)
        if (offset > 0 && text[offset - 1] !== " ") return match
        if (partialEnd) return wrap(match)
        const end = offset + match.length
        if (end < text.length && text[end] !== " ") return match
        return wrap(match)
      },
    )
  }

  return {
    search,
    matchingStatus,
    updateSearchValue,
    highlight,
  }
}
