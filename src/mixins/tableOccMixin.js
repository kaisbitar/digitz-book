import { ref, computed, onMounted } from 'vue'

export function useTableOcc(props, emit) { // Add emit as a parameter
  const windowHeight = ref(window.innerHeight)
  const collapseDone = ref(false)
  const search = ref('')
  const matchingStatus = ref(false)

  
  const getTableHeight = computed(() => {
    let tabHeight = 0
    if (props.includeTab) tabHeight = -20
    return windowHeight.value - 330 + tabHeight
  })

  const collapseHeaders = async group => {
    // Note: This function needs to be adapted to work with Vue 3 refs
    // The current implementation using $refs won't work directly
    // You may need to use template refs or a different approach
    return new Promise(resolve => {
      Object.keys(this.$refs).forEach(k => {
        this.$refs[k].$el.click()
      })

      resolve()
    })
  }

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
    collapseDone,
    search,
    matchingStatus,
    getTableHeight,
    collapseHeaders,
    changeSearch,
    changeMatchingStatus,
    highlight,
    handleFiltering,
    toggleMatching,
    matchChanged,
    
  }
}
