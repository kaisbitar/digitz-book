import { storeToRefs } from "pinia"
import { useQuranStore } from "../stores/app"

export function useCounting() {
  const store = useQuranStore()
  const suraNumber = computed(() =>
    parseInt(store.getTarget.fileName.replace(/^\D+/g, ""))
  )

  const countVerseWords = (verseText) => {
    return String(verseText.split(" ").length)
  }
  const countVerseLetters = (verseText) => {
    return String(verseText.replace(/ /g, "").length)
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

  const setSuraFromArrow = (direction) => {
    if (direction === "up") {
      store.setTarget({
        fileName: store.getQuranIndex[suraNumber.value - 1].fileName,
      })
      return
    }
    store.setTarget({
      fileName: store.getQuranIndex[suraNumber.value + 1].fileName,
    })
  }

  return {
    setSuraFromArrow,
    countWordMatch,
    countVerseWords,
    countVerseLetters,
  }
}
