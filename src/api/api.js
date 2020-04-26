import axios from "axios";

export function fetchQuranIndex(appApi) {
    return axios.get(appApi + `api/quran-index/quranIndex`).then(response => {
      return response.data;
    });
  }