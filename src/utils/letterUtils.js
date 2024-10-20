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

/**
 * Get base character for a given variation
 * @param {string} char
 * @returns {string}
 */
const getBaseChar = (char) => {
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
