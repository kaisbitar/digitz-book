import { useStore } from "../stores/appStore"

export function useCounting() {
  const countVerseWords = (verseText) => {
    if (verseText === "") return 0
    return verseText.split(" ").length
  }
  const countVerseLetters = (verseText) => {
    return verseText.replace(/ /g, "").length || 0
  }

  const countWordMatch = (search, data) => {
    if (!search || !data) return 0
    const searchString = search.trim()
    let count = 0
    data.forEach((item) => {
      const text = item.verseText
      const regex = new RegExp(searchString, "gi")
      const matches = text.match(regex)
      if (matches) {
        count += matches.length
      }
    })
    return count
  }

  return {
    countWordMatch,
    countVerseWords,
    countVerseLetters,
  }
}
