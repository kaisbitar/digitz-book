// Turns verses into the word-by-word timeline the همس player walks. The letters
// come from the source text, so the timeline only rebuilds on a speed change.
import { computed } from "vue"
import { getBaseChar, stripMarks } from "@/utils/letterUtils"

// A letter must be one that carries a tone. Letters with no Quran count (hamza
// forms, ta marbuta) are dropped, and getBaseChar folds the rest to their base.
// \u0671 (alif wasla, the ٱ of ٱل) sits above the main Arabic block, so it is
// easy to miss here — but getBaseChar folds it to ا and countLettersInQuran
// counts it, so leaving it out made every ٱل word play one letter short.
const isToneLetter = (char) => /[\u0621-\u063A\u0641-\u064A\u0671]/.test(char)

// The letters a word sounds, in order. Repeated letters replay, so a word is
// the sequence of its letters, not its set of them.
export const notesFor = (word) =>
  stripMarks(word)
    .split("")
    .filter(isToneLetter)
    .map(getBaseChar)

export function useHumsTimeline(verses, speed, letterSeconds, versePause) {
  const timeline = computed(() => {
    if (!verses?.value?.length) return []
    const steps = letterSeconds / speed.value
    const pause = versePause / speed.value
    const slots = []
    let cursor = 0
    verses.value.forEach((verse) => {
      const words = stripMarks(verse.verseText || "")
        .split(/\s+/)
        .filter(Boolean)
      words.forEach((word, index) => {
        const notes = notesFor(word)
        if (!notes.length) return
        const duration = notes.length * steps
        const tail = index === words.length - 1 ? pause : 0
        slots.push({
          text: word,
          notes,
          verseIndex: verse.verseIndex,
          tail,
          start: cursor,
          duration: duration + tail,
        })
        cursor += duration + tail
      })
    })
    return slots
  })

  return { timeline }
}
