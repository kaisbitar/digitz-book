import { getCharVariations } from './characterVariations'

export const generateStrictSearchRegex = (search: string): RegExp => {
  const allowedExtras = '[يوا]'
  const tashkeelPattern = '[\u064B-\u0652\u0670]*'  // Optional tashkeel
  
  const searchRegex = search
    .split("")
    .map((char) => {
      const variations = getCharVariations(char).join("")
      // Add tashkeel pattern after each character variation
      return `[${variations}]${tashkeelPattern}(?:${allowedExtras}*?)`
    })
    .join("")
    
  return new RegExp(searchRegex, "g")
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