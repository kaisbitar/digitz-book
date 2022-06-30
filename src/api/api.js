import axios from 'axios'

export function fetchOneQuranFile (appApi) {
  return axios
    .get(appApi + 'api/allSurasData/all')
    .then(response => {
      return response.data
    })
}
export function fetchtableQuranIndex (appApi) {
  return axios.get(appApi + 'api/quran-index').then(response => {
    return response.data
  })
}
export function fetchAllVersesWithTashkeel (appApi) {
  return axios
    .get(appApi + 'api/allVersesWithTashkeel')
    .then(response => {
      return response.data
    })
}
export function fetchSuraDetails (appApi, fileName) {
  return axios
    .get(appApi + 'api/view/sura-details/' + fileName)
    .then(response => {
      return response.data
    })
}
