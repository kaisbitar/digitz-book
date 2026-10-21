// Turns verses into the slot-by-slot timeline the همس player walks. A slot is a
// letter run (letter mode), a word (word mode), or a whole verse (verse mode).
// The letters come from the source text, so the timeline only rebuilds on a
// speed or mode change.
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
  stripMarks(word).split("").filter(isToneLetter).map(getBaseChar)

export function useHumsTimeline(
  verses,
  speed,
  letterSeconds,
  versePause,
  phrase = {},
) {
  const timeline = computed(() => {
    if (!verses?.value?.length) return []
    const steps = letterSeconds.value / speed.value
    // Only word mode has a fixed word time. Letter mode must span letters × step,
    // or a long word is cut off and the letter duration has no effect.
    const isWordMode = !!phrase.wordMode?.value
    const wordSecs = isWordMode ? phrase.wordSeconds?.value : 0
    const wordStop = (phrase.wordStop?.value || 0) / speed.value
    const pause = versePause.value / speed.value
    const perPulse = Math.max(1, phrase.wordsPerPulse?.value || 1)
    const beatPause = (phrase.phrasePause?.value || 0) / speed.value
    const slots = []
    let cursor = 0
    verses.value.forEach((verse) => {
      // Verse mode: the whole verse is one frequency, so the loop runs once for
      // it and the word list is not walked. The verse's letters are its every
      // word's letters in order.
      if (phrase.verseMode?.value) {
        const notes = notesFor(verse.verseText || "")
        if (!notes.length) return
        const duration = (phrase.verseSeconds?.value || 1) / speed.value
        slots.push({
          text: verse.verseText || "",
          notes,
          wordIndex: -1,
          verseText: verse.verseText || "",
          verseIndex: verse.verseIndex,
          start: cursor,
          // The verse gets its own slot, then the same pause as any verse end.
          duration: duration + pause,
        })
        cursor += duration + pause
        return
      }
      const words = (verse.verseText || "").split(/\s+/).filter(Boolean)
      let sounded = 0
      words.forEach((word, index) => {
        const notes = notesFor(word)
        if (!notes.length) return
        // Letter mode holds the word for as long as its letters take, so the
        // last letter is never cut off. Word mode is one tone for the whole
        // word, so every word gets the same fixed time however long it is.
        const duration = isWordMode ? wordSecs / speed.value : notes.length * steps
        // Letter mode: the same stop after every word. Word mode: a beat pause
        // every perPulse-th word. Either way the verse end uses the longer pause.
        const isBeatEnd = sounded % perPulse === perPulse - 1
        const isVerseEnd = index === words.length - 1
        const beatTail = isBeatEnd ? beatPause : 0
        const tail = isVerseEnd ? pause : isWordMode ? beatTail : wordStop
        sounded++
        slots.push({
          text: word,
          notes,
          wordIndex: index,
          verseText: verse.verseText || "",
          verseIndex: verse.verseIndex,
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
