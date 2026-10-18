// A word has a numeric value (its letter values summed), not a frequency.
// Any Hz comes from a choice, so this file keeps both choices explicit.
//
// Measured over the whole Quran: values span 3..104 with 99 distinct values.
// Scales snap those onto consonant pitches (pleasant, but ratios no longer
// hold). Literal keeps the ratios exact and only transposes them into range.
export const LITERAL = "literal"

// Letter counts are the Quran-wide frequencies (dataStore.getQuranLetterCounts).
// Every letter plays its own count, transposed by DIVISOR into hearing range:
// 853..56762 becomes 42.6..2838 Hz, so alif sounds 63.5x above za, exactly.
export const LETTER_DIVISOR = 20

// Hearing runs 20 Hz - 16 kHz. All 28 letters stay inside that band only
// between roughly x0.5 and x5; the extremes below push za under 20 Hz or alif
// past 16 kHz, so the UI flags them rather than silently going quiet.
export const AUDIBLE_MIN_HZ = 20
export const AUDIBLE_MAX_HZ = 16000
// Verses sound at several times a letter's pitch, because a word's frequency is
// its letters' summed. The list reaches low enough for word mode: 0.01 puts even
// a long word back inside the audible band.
export const MULTIPLIERS = [0.01, 0.025, 0.05, 0.075, 0.1, 1, 10, 100, 1000]

export const toneForLetter = (letter, counts, multiplier = 1) => {
  const count = counts?.[letter]
  return count ? (count / LETTER_DIVISOR) * multiplier : 0
}

// A word's frequency is the sum of its letters'. Letters with no count add 0,
// so a word of unmapped letters is silent rather than a bug.
export const wordToneFor = (letters, counts, multiplier = 1) =>
  (letters || []).reduce((sum, letter) => sum + toneForLetter(letter, counts, multiplier), 0)

export const SCALES = {
  pentatonic: [1, 1.125, 1.25, 1.5, 1.667],
  major: [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875],
  minor: [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.8],
  hijaz: [1, 1.059, 1.26, 1.335, 1.5, 1.6, 1.888],
}

const OCTAVES = 2
export const BASE_HZ = 220

// 3 * 8 = 24 Hz and 104 * 40 = 4160 Hz bracket the comfortable band; outside
// this the low words rumble and the high ones pierce.
export const MIN_GAIN = 8
export const MAX_GAIN = 40
export const DEFAULT_GAIN = 16

export const toneForValue = (
  value,
  scaleName = "pentatonic",
  gain = DEFAULT_GAIN,
  base = BASE_HZ,
) => {
  const safe = Math.max(value, 1)
  // Literal: the value itself, scaled. Every ratio between words is exact.
  if (scaleName === LITERAL) return safe * gain

  const scale = SCALES[scaleName] || SCALES.pentatonic
  // Fold the pitch index into the scale instead of capping the octave: capping
  // sent every value past the cap to the same handful of notes.
  const span = scale.length * (OCTAVES + 1)
  const pitch = (safe - 1) % span
  const degree = pitch % scale.length
  const octave = Math.floor(pitch / scale.length)
  return base * scale[degree] * 2 ** octave
}
