import { storeToRefs } from 'pinia'
import { useQuranStore } from '../stores/app'

export function useMixin() {
  const store = useQuranStore()
  const suraNumber = computed(() => parseInt(store.getTarget.fileName.replace(/^\D+/g, '')))


  const setSuraFromArrow = direction => {
    if (direction === 'up') {
      store.setTarget({
        fileName: store.getQuranIndex[suraNumber.value - 1].fileName,
      })
      return
    }
    store.setTarget({
      fileName: store.getQuranIndex[suraNumber.value + 1].fileName,
    })
  }

  return {
    setSuraFromArrow,
  }
}
