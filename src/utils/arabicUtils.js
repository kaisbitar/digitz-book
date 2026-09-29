import { generatePhraseRegex } from "@/utils/wordFilter/regexGenerators"

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
 * Creates a regex that matches text using the same rules as word search:
 * letter variations (ا/أ/إ/آ, ه/ة, ى/ي ...) and optional tashkeel.
 * @param {string} text - The Arabic text to match
 * @param {string} [flags] - RegExp flags. Omit "g" for .test()/.match() filtering.
 * @returns {RegExp}
 */
export const createArabicPattern = (text, flags = "") => {
  if (!text) return new RegExp("")
  return generatePhraseRegex(text, flags)
}
