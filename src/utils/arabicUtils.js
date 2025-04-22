/**
 * Removes tashkeel (diacritics) from Arabic text
 * @param {string} text - The Arabic text with tashkeel
 * @returns {string} - The text without tashkeel
 */
export const removeTashkeel = (text) => {
  if (!text) return text
  // Remove all tashkeel characters (Fatha, Kasra, Damma, Sukun, Shadda, etc.)
  return text.replace(/[\u064B-\u0652\u0670]/g, "")
}

/**
 * Creates a regex pattern that matches text with or without tashkeel
 * @param {string} text - The Arabic text to match
 * @returns {RegExp} - A regex that matches the text with optional tashkeel between characters
 */
export const createArabicPattern = (text) => {
  if (!text) return new RegExp("")
  const tashkeelPattern = "[\u064B-\u0652\u0670]*"
  const pattern = text.split("").join(tashkeelPattern) + tashkeelPattern
  return new RegExp(pattern, "g")
}
