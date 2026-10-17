// Interfaces (for documentation purposes, as this is JavaScript)
/**
 * @typedef {Object.<string, string[]>} CharVariations
 * @typedef {Object.<string, number>} LetterCounts
 */

/**
 * @type {CharVariations}
 */
const variations = {
  ا: ["ا", "أ", "إ", "آ", "ٱ", "ء", "ى"],
  ه: ["ه", "ة"],
  ي: ["ي", "ئ"],
  و: ["و", "ؤ"],
}

// Quranic diacritics and annotation marks, whitespace included.
const DIACRITICS =
  /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED\s]/g
// The same marks, whitespace kept. For callers that keep word boundaries.
const MARKS = /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g

/**
 * Removes Quranic marks from text, keeping whitespace.
 * @param {string} text
 * @returns {string}
 */
export function stripMarks(text) {
  if (!text) return text
  return String(text).replace(MARKS, "")
}

/**
 * Unique base letters of a word, in the order they appear.
 * @param {string} word
 * @returns {string[]}
 */
export function lettersOf(word) {
  const seen = []
  const text = String(word || "").replace(DIACRITICS, "")
  for (const char of text) {
    if (!/[\u0600-\u06FF]/.test(char)) continue
    const letter = getBaseChar(char)
    if (seen.includes(letter)) continue
    seen.push(letter)
  }
  return seen
}

/**
 * Get base character for a given variation
 * @param {string} char
 * @returns {string}
 */
export const getBaseChar = (char) => {
  for (const [base, chars] of Object.entries(variations)) {
    if (chars.includes(char)) {
      return base
    }
  }
  return char
}

/**
 * Count letters in the entire Quran
 * @param {string} quranText
 * @returns {LetterCounts}
 */
export function countLettersInQuran(quranText) {
  const letterCounts = {}

  for (const char of quranText) {
    if (/[\u0600-\u06FF]/.test(char)) {
      // Only count Arabic characters
      const baseChar = getBaseChar(char)
      letterCounts[baseChar] = (letterCounts[baseChar] || 0) + 1
    }
  }

  return letterCounts
}

/**
 * Get total letter count
 * @param {LetterCounts} letterCounts
 * @returns {number}
 */
export function getTotalLetterCount(letterCounts) {
  return Object.values(letterCounts).reduce((sum, count) => sum + count, 0)
}
