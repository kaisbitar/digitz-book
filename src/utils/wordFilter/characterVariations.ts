import { CharVariations } from './types'

const variations: CharVariations = {
  ا: ["ا", "أ", "إ", "آ", "ٱ"],
  آ: ["آ", "ء", "ا"],
  ه: ["ه", "ة"],
  ت: ["ت", "ة"],
  ة: ["ت", "ة"],
  ى: ["ى", "ي", "ئ", "ء"],
  و: ["و", "ؤ"],
  ي: ["ي", "ئ", "ى", "ء"],
  إ: ["ا", "أ", "إ", "آ", "ٱ"],
  ء: ["ء", "ئ", "ؤ"],
}

export const getCharVariations = (char: string): string[] => {
  return variations[char] || [char]
} 