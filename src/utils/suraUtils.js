// src/utils/suraUtils.js

export const prepareSuraData = ({
  oneQuranFile,
  startIndex,
  endIndex,
  versesBasics,
  suraTextArray,
  letterSeries,
  wordsSeries,
}) => {
  const letters = []
  const words = []
  versesBasics.value = []
  suraTextArray.value = []
  oneQuranFile.value.forEach((item, index) => {
    if (index <= startIndex.value - 1 || index >= endIndex.value) return
    versesBasics.value.push(buildVerseObject(item))
    suraTextArray.value.push(item.verseText)
    letters.push(item.verseText.replace(/ /g, "").length)
    words.push(item.verseText.split(" ").length)
  })
  letterSeries.value = [{ data: letters }]
  wordsSeries.value = [{ data: words }]
}

export const prepareMushafData = ({
  oneQuranFile,
  versesBasics,
  suraTextArray,
  letterSeries,
  versesSeries,
  wordsSeries,
  tableQuranIndex,
}) => {
  versesBasics.value = oneQuranFile.value.map((item) => buildVerseObject(item))
  suraTextArray.value = oneQuranFile.value.map((item) => item.verseText)
  letterSeries.value = getMushafSeries("numberOfLetters", tableQuranIndex)
  versesSeries.value = getMushafSeries("numberOfVerses", tableQuranIndex)
  wordsSeries.value = getMushafSeries("numberOfWords", tableQuranIndex)
}

export const setSuraToolTip = ({
  suraTextArray,
  tooltipLabel,
  tooltipLabel2,
  chartOptions,
}) => {
  var x = {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      return (
        '<div class="mr-2 ml-2 pt-2">' +
        '<div class="d-flex"><span class="tipInfo"><span class="tipLabel">' +
        tooltipLabel2.value +
        " </span> " +
        parseInt(dataPointIndex + 1) +
        "</span>" +
        '<span class="tipInfo tipInfo2">' +
        w.globals.series[0][dataPointIndex] +
        ' <span class="tipLabel">' +
        tooltipLabel.value +
        "</span></span></div>" +
        '<p class="tipInfo tipText pr-1 pl-2">' +
        suraTextArray.value[dataPointIndex] +
        "</p>" +
        "</div>"
      )
    },
    shared: true,
    followCursor: true,
  }
  chartOptions.value = {
    ...chartOptions.value,
    ...{ tooltip: x },
  }
}

export const setMushafToolTip = ({ tableQuranIndex, setSuraToolTip }) => {
  var QuranToolTip = tableQuranIndex.value.map((item) => {
    return item.fileName.replace(/[0-9]/g, "")
  })
  setSuraToolTip(QuranToolTip.shift())
}

const buildVerseObject = (item) => ({
  fileName: item.fileName,
  verseIndex: item.verseIndex.toString(),
  verseText: item.verseText,
  numberOfWords: item.verseText.split(" ").length.toString(),
  numberOfLetters: item.verseText.replace(/ /g, "").length.toString(),
  verseNumberToQuran: item.verseNumberToQuran.toString(),
})

const getMushafSeries = (fieldPlaceHolder, tableQuranIndex) => {
  const arr = tableQuranIndex.value.map((item) => item[fieldPlaceHolder])
  arr.shift()
  return [{ data: arr }]
}
