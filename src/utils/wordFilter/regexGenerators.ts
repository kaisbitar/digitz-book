import { getCharVariations } from './characterVariations'

// Optional tashkeel / Quranic marks that may follow any letter.
export const TASHKEEL_PATTERN =
  '[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]*'

// The Quran text writes many long alefs as a dagger-alef mark instead of a letter.
const DAGGER_ALEF = '\u0670'
const ALEF_LETTERS = new Set(['ا', 'أ', 'إ', 'آ', 'ٱ'])

// Escape characters that are special inside a regex character class.
const escapeForClass = (char: string): string => char.replace(/[\\\]^-]/g, '\\$&')

// A character class matching a letter and all of its variations.
const charClass = (char: string): string =>
  `[${getCharVariations(char).map(escapeForClass).join('')}]`

// A letter pattern. A typed alef in the middle of a word also matches the
// dagger-alef mark, so "الكتاب" finds the stored "الكِتَٰب".
const letterPattern = (char: string, isWordStart: boolean): string => {
  if (isWordStart || !ALEF_LETTERS.has(char)) return charClass(char)
  return `(?:${DAGGER_ALEF}|${charClass(char)})`
}

export const generateStrictSearchRegex = (search: string): RegExp => {
  const allowedExtras = '[يوا]'

  const searchRegex = search
    .split("")
    .map((char, index) => {
      // Add tashkeel pattern after each character variation
      return `${letterPattern(char, index === 0)}${TASHKEEL_PATTERN}(?:${allowedExtras}*?)`
    })
    .join("")

  // No "g" flag: a global regex keeps lastIndex between .test() calls,
  // which both slows the hot loop and can skip valid matches.
  return new RegExp(searchRegex)
}

/**
 * Matches a whole word (same letter variations, tashkeel and dagger-alef
 * tolerance as search) with no extra letters and no partial matches.
 */
export const generateWholeWordRegex = (word: string): RegExp => {
  const body = word
    .split("")
    .map((char, index) => `${letterPattern(char, index === 0)}${TASHKEEL_PATTERN}`)
    .join("")
  return new RegExp(`^${body}$`)
}

/**
 * Regex for searching verses / phrases with the same letter variations and
 * tashkeel tolerance as word search. Runs of whitespace match any whitespace.
 * Pass "g" as flags when the regex is used for replace/highlighting.
 */
export const generatePhraseRegex = (text: string, flags: string = ""): RegExp => {
  let pattern = ""
  let previousWasSpace = false
  let isWordStart = true

  for (const char of text) {
    if (/\s/.test(char)) {
      if (!previousWasSpace) pattern += "\\s+"
      previousWasSpace = true
      isWordStart = true
      continue
    }
    previousWasSpace = false
    pattern += `${letterPattern(char, isWordStart)}${TASHKEEL_PATTERN}`
    isWordStart = false
  }

  return new RegExp(pattern, flags)
}

export const generateSuggestionRegex = (search: string): RegExp => {
  const searchRegex = search
    .split("")
    .map((char) => `(?=.*${charClass(char)})`)
    .join("")
  return new RegExp(`^${searchRegex}.+`, "g")
}
