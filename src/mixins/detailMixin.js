import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '../stores/app'

export function useDetailMixin(props) {
  const quranStore = useQuranStore()

  const detailElement = ref('')
  const detailCount = ref(0)
  const search = ref('')
  const footerProps = ref({ 'items-per-page-text': '', 'items-per-page-options': [75, 150, -1] })
  const selectedId = ref('')
  const showChart = ref(true)
  const windowHeight = ref(window.innerHeight)
  const groupBy = ref('y')
  const tab = ref(null)

  const fileName = computed(() => quranStore.getTarget.fileName)

  function setDetailItem(index, item) {
    selectedId.value = item.x
    detailElement.value = item.x
    detailCount.value = item.y
  }

  function setInitialItem() {
    if (props.occurrences.length === 0) return
    selectedId.value = props.occurrences[0].x
    detailElement.value = props.occurrences[0].x
    detailCount.value = props.occurrences[0].y
  }

  watch(
    () => props.indexes,
    () => {
      if (props.occurrences.length === 0) return null
      setInitialItem()
    },
  )

  return {
    detailElement,
    detailCount,
    search,
    footerProps,
    selectedId,
    showChart,
    windowHeight,
    groupBy,
    tab,
    fileName,
    setDetailItem,
    setInitialItem,
  }
}
