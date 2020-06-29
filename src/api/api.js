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
export function fetchSuraText (appApi, fileName) {
  return axios
    .get(appApi + 'api/view/' + fileName)
    .then(response => {
      return response.data
    })
}
export function fetchSuraData (appApi, fileName, dataType) {
  return axios
    .get(appApi + 'api/view/sura/' + dataType + '/' + fileName)
    .then(response => {
      return response.data
    })
}
export function fetchChartData (appApi, fileName, dataType) {
  return axios
    .get(appApi + 'api/view/verses/' + dataType + '/' + fileName)
    .then(response => {
      return response.data
    })
}
export function fetchTableData (appApi, fileName, dataType) {
  return axios
    .get(appApi + 'api/view/' + dataType + '/' + fileName)
    .then(response => {
      return response.data
    })
}
