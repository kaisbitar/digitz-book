export const analyzeDuality = (quranFile) => {
  const firstFiftyVerses = quranFile.slice(0, 50)

  return firstFiftyVerses.map((verse) => {
    const words = verse.verseText.split(" ")
    const patterns = []

    for (let start = 0; start < words.length; start++) {
      for (
        let firstLength = 2;
        firstLength <= words.length - start;
        firstLength++
      ) {
        const firstSequence = words.slice(start, start + firstLength).join(" ")
        const firstCount = countLetters(firstSequence)

        const secondStart = start + firstLength

        for (
          let secondLength = 2;
          secondLength <= words.length - secondStart;
          secondLength++
        ) {
          const secondSequence = words
            .slice(secondStart, secondStart + secondLength)
            .join(" ")
          const secondCount = countLetters(secondSequence)

          if (secondCount === firstCount) {
            patterns.push({
              firstSequence,
              secondSequence,
              firstIndices: [start, start + firstLength - 1],
              secondIndices: [secondStart, secondStart + secondLength - 1],
              letterCount: firstCount,
              secondLetterCount: secondCount,
              difference: 0,
            })
          }
        }
      }
    }

    return {
      verseIndex: verse.verseIndex,
      verseText: verse.verseText,
      patterns: patterns.sort((a, b) => b.letterCount - a.letterCount),
    }
  })
}

const countLetters = (text) => {
  const withoutDiacritics = text.replace(/[\u064B-\u065F\u0670\u0640]/g, "")
  const lettersOnly = withoutDiacritics.replace(/\s+/g, "")
  const letterCount = lettersOnly
    .replace(/[^\u0621-\u063A\u0641-\u064A]/g, "")
    .split("")
    .reduce((count, char) => {
      return count + 1
    }, 0)

  return letterCount
}

export const analyzeExactSequences = (quranFile) => {
  return quranFile
    .map((verse) => {
      const words = verse.verseText.split(" ")
      const patterns = []

      for (let i = 1; i < words.length; i++) {
        const firstPart = words.slice(0, i).join(" ")
        const secondPart = words.slice(i).join(" ")

        const firstLetterCount = countLetters(firstPart)
        const secondLetterCount = countLetters(secondPart)

        if (firstLetterCount === secondLetterCount) {
          patterns.push({
            firstSequence: firstPart,
            secondSequence: secondPart,
            firstIndices: [0, i - 1],
            secondIndices: [i, words.length - 1],
            letterCount: firstLetterCount,
            secondLetterCount: secondLetterCount,
            difference: 0,
          })
        }
      }

      return {
        verseIndex: verse.verseIndex,
        verseText: verse.verseText,
        patterns: patterns.sort((a, b) => b.letterCount - a.letterCount),
      }
    })
    .filter((verse) => verse.patterns.length > 0)
}

export const analyzeGoldenRatio = (quranFile) => {
  const firstFiftyVerses = quranFile.slice(0, 50)

  return quranFile
    .map((verse) => {
      const words = verse.verseText.split(" ")
      const patterns = []

      for (let i = 1; i < words.length; i++) {
        const firstPart = words.slice(0, i).join(" ")
        const secondPart = words.slice(i).join(" ")

        const firstLetterCount = countLetters(firstPart)
        const secondLetterCount = countLetters(secondPart)
        const totalCount = firstLetterCount + secondLetterCount

        // Check if sum is divisible by 19
        if (totalCount % 19 === 0) {
          patterns.push({
            firstSequence: firstPart,
            secondSequence: secondPart,
            firstIndices: [0, i - 1],
            secondIndices: [i, words.length - 1],
            firstLetterCount: firstLetterCount,
            secondLetterCount: secondLetterCount,
            totalCount: totalCount,
            factor19: totalCount / 19, // How many times it's divisible by 19
          })
        }
      }

      return {
        verseIndex: verse.verseIndex,
        verseText: verse.verseText,
        patterns: patterns.sort((a, b) => b.totalCount - a.totalCount),
      }
    })
    .filter((verse) => verse.patterns.length > 0)
}

export const analyzeNumberDivisibility = (quranFile) => {
  const firstFiftyVerses = quranFile.slice(0, 50)

  return firstFiftyVerses
    .map((verse) => {
      const words = verse.verseText.split(" ")
      const patterns = []

      for (let i = 1; i < words.length; i++) {
        const firstPart = words.slice(0, i).join(" ")
        const secondPart = words.slice(i).join(" ")

        const firstLetterCount = countLetters(firstPart)
        const secondLetterCount = countLetters(secondPart)
        const totalCount = firstLetterCount + secondLetterCount

        // Find all divisors between 2 and totalCount/2
        for (let divisor = 2; divisor <= totalCount / 2; divisor++) {
          if (totalCount % divisor === 0) {
            patterns.push({
              firstSequence: firstPart,
              secondSequence: secondPart,
              firstIndices: [0, i - 1],
              secondIndices: [i, words.length - 1],
              firstLetterCount: firstLetterCount,
              secondLetterCount: secondLetterCount,
              totalCount: totalCount,
              divisor: divisor,
              factor: totalCount / divisor,
            })
          }
        }
      }

      return {
        verseIndex: verse.verseIndex,
        verseText: verse.verseText,
        patterns: patterns.sort((a, b) => a.divisor - b.divisor),
      }
    })
    .filter((verse) => verse.patterns.length > 0)
}
