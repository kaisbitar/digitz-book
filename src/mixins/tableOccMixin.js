import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'

export function useTableOcc(props, emit) { 
  const store = useQuranStore()

  const search = ref('')
  const matchingStatus = ref(false)

  
  const windowHeight = computed(() => window.innerHeight)  
  const activeRoute = computed(() => store.getActiveMode)  
  const activeView = computed(() => store.getActiveView)  
  const activeTab = computed(() => store.getActiveTab)

  const getTableHeight = computed(() => {
    let height = windowHeight.value
    if(activeRoute.value === 'singleSura') {
      height = height - 330
    }

    if(activeRoute.value === 'search') {
        height = height - 410
    }

    return height
  })

  const getTextBoxHeight = computed(() => {
    let height = windowHeight.value
    if(activeRoute.value === 'singleSura') {
      height = height - 15
    }

    if(activeRoute.value === 'search') {
        height = height - 90
    }
    return height
  })

  function changeSearch(newSearch) {
    search.value = newSearch
  }

  const changeMatchingStatus = newMatchingStatus => {
    matchingStatus.value = newMatchingStatus[1]
    search.value = newMatchingStatus[0]
  }

  const matchChanged = () => {
    emit('matchChanged', [search.value, matchingStatus.value])
  }
  
  const toggleMatching = () => {
    matchingStatus.value = !matchingStatus.value
    matchChanged()
  }

  const highlight = (text, searchInput) => {
    if (!text) return
    text = text.toString()
    if (!searchInput) return text
    return text.replace(new RegExp(searchInput, 'gi'), match => {
      return `<span class="highlight-match">${match}</span>`
    })
  }

  const handleFiltering = (item, queryText, itemText) => {
    if (!queryText) return true

    if (!itemText.columns) {
      itemText.columns = itemText.raw
    }

    const containsSearch = (text, query) => {
      if (!matchingStatus.value) {
        return text.includes(query)
      }
  
      return text.includes(' ' + query + ' ')
    }
  
    return (
      containsSearch(itemText.columns.fileName, queryText) ||
      containsSearch(itemText.columns.verseText, queryText)
    )
  }
  return {
    windowHeight,
    search,
    matchingStatus,
    getTableHeight,
    getTextBoxHeight,
    changeSearch,
    changeMatchingStatus,
    highlight,
    handleFiltering,
    toggleMatching,
    matchChanged,
    
  }
}
