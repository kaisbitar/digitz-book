import { storeToRefs } from 'pinia'
import { useQuranStore } from '../stores/app'

export function useNavigation() {
  const quranStore = useQuranStore()
  const { tableQuranIndex } = storeToRefs(quranStore)

  const prepareToScroll = item => {
    if (parseInt(item) < 0) return '#v1'
    return '#v' + parseInt(item)
  }

  const setTargetFromArrow = (direction, suraNumber) => {
    if (direction === 'up') {
      quranStore.setTarget({ fileName: tableQuranIndex.value[suraNumber - 1].fileName })
    } else {
      quranStore.setTarget({ fileName: tableQuranIndex.value[suraNumber + 1].fileName })
    }
  }

  const highlight = (text, searchValue) => {
    if (!searchValue) {
      return text
    }

    let suraChunk =
      text.indexOf(searchValue) > 53 ? '...' + text.slice(text.indexOf(searchValue) - 30) : text

    return suraChunk.replace(new RegExp(searchValue, 'gi'), match => {
      return '<span style="background:yellow; font-weight: bold;">' + match + '</span>'
    })
  }

  return {
    prepareToScroll,
    setTargetFromArrow,
    highlight,
  }
}
