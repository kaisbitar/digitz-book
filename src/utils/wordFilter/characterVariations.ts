import { CharVariations } from './types'

// Letters that are interchangeable when searching. Matching is symmetric:
// typing any letter of a group matches every other letter of that group.
const EQUIVALENT_GROUPS: string[][] = [
  ["ا", "أ", "إ", "آ", "ٱ"],
  ["ه", "ة"],
  ["ت", "ة"],
  ["ى", "ي", "ئ", "ء"],
  ["و", "ؤ"],
  ["ء", "ئ", "ؤ"],
]

// One-directional extras kept from the original table.
const EXTRA_VARIATIONS: CharVariations = {
  آ: ["ء"],
}

const buildVariations = (): CharVariations => {
  const sets: Record<string, Set<string>> = {}

  EQUIVALENT_GROUPS.forEach((group) => {
    group.forEach((char) => {
      sets[char] = sets[char] || new Set([char])
      group.forEach((other) => sets[char].add(other))
    })
  })

  Object.entries(EXTRA_VARIATIONS).forEach(([char, extras]) => {
    sets[char] = sets[char] || new Set([char])
    extras.forEach((extra) => sets[char].add(extra))
  })

  const result: CharVariations = {}
  Object.entries(sets).forEach(([char, set]) => {
    result[char] = Array.from(set)
  })
  return result
}

const variations: CharVariations = buildVariations()

export const getCharVariations = (char: string): string[] => {
  return variations[char] || [char]
}
