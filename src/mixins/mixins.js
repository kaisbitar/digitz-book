import { storeToRefs } from 'pinia'
import { useQuranStore } from '../stores/app'

export function useMixin() {
  const store = useQuranStore()
  const suraNumber = computed(() => parseInt(store.getTarget.fileName.replace(/^\D+/g, '')))

  const createVerseId = item => {
    if (parseInt(item) < 0) return '#v1'
    return '#v' + parseInt(item)
  }

  const setTargetFromArrow = direction => {
    if (direction === 'up') {
      store.setTarget({
        fileName: store.getTableQuranIndex[suraNumber.value - 1].fileName,
      })
    } else {
      store.setTarget({
        fileName: store.getTableQuranIndex[suraNumber.value + 1].fileName,
      })
    }
  }

  const highlight = (text, searchValue) => {
    // console.log(text, searchValue)
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
    createVerseId,
    setTargetFromArrow,
    highlight,
  }
}
