import { getCharVariations } from './characterVariations'

export const generateStrictSearchRegex = (search: string): RegExp => {
  const allowedExtras = '[يوا]'
  const tashkeelPattern = '[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]*'  // Optional tashkeel
  
  const searchRegex = search
    .split("")
    .map((char) => {
      const variations = getCharVariations(char).join("")
      // Add tashkeel pattern after each character variation
      return `[${variations}]${tashkeelPattern}(?:${allowedExtras}*?)`
    })
    .join("")

  // No "g" flag: a global regex keeps lastIndex between .test() calls,
  // which both slows the hot loop and can skip valid matches.
  return new RegExp(searchRegex)
}

export const generateSuggestionRegex = (search: string): RegExp => {
  const searchRegex = search
    .split("")
    .map((char) => {
      const variations = getCharVariations(char).join("")
      return `(?=.*[${variations}])`
    })
    .join("")
  return new RegExp(`^${searchRegex}.+`, "g")
} 