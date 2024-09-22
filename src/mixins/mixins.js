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

  return {
    createVerseId,
    setTargetFromArrow,
  }
}
