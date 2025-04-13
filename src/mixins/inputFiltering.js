import { ref } from "vue"

export function useInputFiltering() {
  const search = ref("")
  const matchingStatus = ref(false)

  function updateSearchValue(newSearch) {
    search.value = newSearch
  }

  const highlight = (text, textToHighlight) => {
    if (!text) return
    if (!textToHighlight) return text
    text = text.toString()

    // Insert optional tashkeel matcher between each letter
    const tashkeelPattern = "[\u064B-\u0652\u0670]*"
    const pattern =
      textToHighlight.split("").join(tashkeelPattern) + tashkeelPattern

    return text.replace(
      new RegExp(pattern, "gi"),
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
