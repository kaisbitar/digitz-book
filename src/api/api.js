import axios from "axios"

export function fetchOneQuranFile(appApi) {
  return getData(appApi + "api/quran-model")
}
export function fetchtableQuranIndex(appApi) {
  return getData(appApi + "api/quran-index")
}
export function fetchAllVersesWithTashkeel(appApi) {
  return getData(appApi + "api/with-tashkeel")
}
export function fetchAllWordsRoots(appApi) {
  return getData(appApi + "api/roots")
}
export function fetchSuraDetails(appApi, fileName) {
  return getData(appApi + "api/view/sura-details/" + fileName)
}
export function fetchWordMeaning(appApi, word) {
  return getData(appApi + `api/scrape/${word}`)
}
function getData(path) {
  return axios.get(path).then((response) => {
    return response.data
  })
}
