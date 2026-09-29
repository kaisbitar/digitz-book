import { getCharVariations } from './characterVariations'

// Optional tashkeel / Quranic marks that may follow any letter.
export const TASHKEEL_PATTERN =
  '[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]*'

// Escape characters that are special inside a regex character class.
const escapeForClass = (char: string): string => char.replace(/[\\\]^-]/g, '\\$&')

// A character class matching a letter and all of its variations.
const charClass = (char: string): string =>
  `[${getCharVariations(char).map(escapeForClass).join('')}]`

export const generateStrictSearchRegex = (search: string): RegExp => {
  const allowedExtras = '[يوا]'

  const searchRegex = search
    .split("")
    .map((char) => {
      // Add tashkeel pattern after each character variation
      return `${charClass(char)}${TASHKEEL_PATTERN}(?:${allowedExtras}*?)`
    })
    .join("")

  // No "g" flag: a global regex keeps lastIndex between .test() calls,
  // which both slows the hot loop and can skip valid matches.
  return new RegExp(searchRegex)
}

/**
 * Regex for searching verses / phrases with the same letter variations and
 * tashkeel tolerance as word search. Runs of whitespace match any whitespace.
 * Pass "g" as flags when the regex is used for replace/highlighting.
 */
export const generatePhraseRegex = (text: string, flags: string = ""): RegExp => {
  let pattern = ""
  let previousWasSpace = false

  for (const char of text) {
    if (/\s/.test(char)) {
      if (!previousWasSpace) pattern += "\\s+"
      previousWasSpace = true
      continue
    }
    previousWasSpace = false
    pattern += `${charClass(char)}${TASHKEEL_PATTERN}`
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
