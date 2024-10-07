export const extractFromDictionnary = (allData) => {
  const lines = allData.split("\n")
  const results = []
  let currentWord = ""
  let currentMeaning = ""
  let currentDictionary = ""

  lines.forEach((line) => {
    line = line.trim()

    if (line && !line.includes("المعنى:") && !line.includes("المعجم:")) {
      if (currentWord === "") {
        currentWord = line
      }
    } else if (line.includes("المعنى:")) {
      currentMeaning = line.replace("المعنى:", "").trim()
    } else if (line.includes("المعجم:")) {
      currentDictionary = line.replace("المعجم:", "").trim()
    }

    if (currentWord && currentMeaning && currentDictionary) {
      results.push({
        word: currentWord,
        meaning: currentMeaning,
        dictionary: currentDictionary,
      })

      currentWord = ""
      currentMeaning = ""
      currentDictionary = ""
    }
  })

  return results
}

const hasThreeLettersInCommon = (word1, word2) => {
  const commonLetters = [...new Set(word1)].filter((letter) =>
    word2.includes(letter)
  )
  return commonLetters.length >= 2
}
