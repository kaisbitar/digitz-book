const calculationVariations = {
  ا: ["ا", "أ", "إ", "آ", "ء"],
  آ: ["ا"],
  إ: ["ا"],
  أ: ["ا"],
  ء: ["ا"],
  و: ["و", "ؤ"],
  ؤ: ["و"],
  ي: ["ي", "ى", "ئ"],
  ى: ["ي"],
  ئ: ["ي"],
  ه: ["ه", "ة"],
  ة: ["ه"],
}

const getCalculationVariations = (char) => {
  return calculationVariations[char] || [char]
}

const fixedLetterValues = {
  ا: 1, // 56762
  ل: 2, // 38102
  ن: 3, // 27268
  م: 4, // 26735
  و: 5, // 25676
  ي: 6, // 23151
  ه: 7, // 17194
  ر: 8, // 12403
  ب: 9, // 11491
  ت: 10, // 10520
  ك: 11, // 10497
  ع: 12, // 9405
  ف: 13, // 8747
  ق: 14, // 7034
  س: 15, // 6010
  د: 16, // 5991
  ذ: 17, // 4932
  ح: 18, // 4140
  ج: 19, // 3317
  خ: 20, // 2497
  ش: 21, // 2124
  ص: 22, // 2074
  ض: 23, // 1686
  ز: 24, // 1599
  ث: 25, // 1414
  ط: 26, // 1273
  غ: 27, // 1221
  ظ: 28, // 853
}

export const calculateValue = (text) => {
  if (!text) return 0
  text = text.replace(
    /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
    ""
  )
  if (text.includes(" ")) {
    return text.split(" ").reduce((total, word) => {
      return total + calculateSingleWordValue(word)
    }, 0)
  }

  return calculateSingleWordValue(text)
}

const calculateSingleWordValue = (word) => {
  return word.split("").reduce((sum, letter) => {
    const variations = getCalculationVariations(letter)

    for (const variant of variations) {
      if (fixedLetterValues[variant]) {
        return sum + fixedLetterValues[variant]
      }
    }

    console.warn(`No value found for letter: ${letter}`)
    return sum
  }, 0)
}

export function useCounting() {
  const countVerseWords = (verseText) => {
    if (verseText === "") return 0
    return verseText.split(" ").length
  }

  const countVerseLetters = (verseText) => {
    const cleanText = verseText
      .replace(
        /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED]/g,
        ""
      )
      .replace(/\s+/g, "")

    return cleanText.length || 0
  }

  const countWordMatch = (search, data) => {
    if (!search || !data) return 0
    const searchString = search.trim()
    let count = 0
    data.forEach((item) => {
      const text = item.verseText
      const regex = new RegExp(searchString, "gi")
      const matches = text.match(regex)
      if (matches) {
        count += matches.length
      }
    })
    return count
  }

  return {
    countWordMatch,
    countVerseWords,
    countVerseLetters,
    calculateValue,
    getCalculationVariations,
  }
}
