import axios from 'axios'

export function fetchOneQuranFile (appApi) {
  return getData(appApi + 'api/allSurasData/all')
}
export function fetchtableQuranIndex (appApi) {
  return getData(appApi + 'api/quran-index')
}
export function fetchAllVersesWithTashkeel (appApi) {
  return getData(appApi + 'api/allVersesWithTashkeel')
}
export function fetchSuraDetails (appApi, fileName) {
  return getData(appApi + 'api/view/sura-details/' + fileName)
}
function getData (path) {
  return axios
    .get(path)
    .then(response => {
      return response.data
    })
}
