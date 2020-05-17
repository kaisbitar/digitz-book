import axios from "axios";

export function fetchQuranIndex(appApi) {
    return axios.get(appApi + `api/quran-index/quranIndex`).then(response => {
      return response.data;
    });
  }
export function fetchSearchData(appApi) {
  return axios
        .get(appApi + `api/allSurasData/all`)
        // .then(res => res.clone().json())
        .then(response => {
      return response.data;
  });
}
export function fetchSuraText(appApi, fileName) {
  return axios
        .get(appApi + `api/view/` + fileName)
        // .then(res => res.clone().json())
        .then(response => {
      return response.data;
  });
}
  