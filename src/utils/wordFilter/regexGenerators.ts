import { getCharVariations } from './characterVariations'

export const generateStrictSearchRegex = (search: string): RegExp => {
  const allowedExtras = '[يوا]'
  const searchRegex = search
    .split("")
    .map((char) => {
      const variations = getCharVariations(char).join("")
      return `[${variations}](?:${allowedExtras}*?)`
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