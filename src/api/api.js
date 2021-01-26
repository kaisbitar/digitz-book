import axios from 'axios'

export function fetchQuranIndex (appApi) {
  return axios.get(appApi + 'api/quran-index').then(response => {
    return response.data
  })
}
export function fetchFileNames (appApi) {
  return axios.get(appApi + 'api/fileNames').then(response => {
    return response.data
  })
}
export function fetchSearchData (appApi) {
  return axios
    .get(appApi + 'api/allSurasData/all')
  // .then(res => res.clone().json())
    .then(response => {
      return response.data
    })
}
export function fetchSuraBasics (appApi, fileName) {
  return axios
    .get(appApi + 'api/view/sura-basics/' + fileName)
    .then(response => {
      return response.data
    })
}
export function fetchSuraText (appApi, fileName) {
  return axios
    .get(appApi + 'api/view/sura-text/' + fileName)
    .then(response => {
      return response.data
    })
}
export function fetchSuraChartData (appApi, fileName, dataType) {
  return axios
    .get(appApi + 'api/view/sura-charts/' + fileName)
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

export function fetchSearchResults (appApi, query) {
  return axios
    .get(appApi + 'api/view/search/' + query)
    .then(response => {
      return response.data
    })
}
