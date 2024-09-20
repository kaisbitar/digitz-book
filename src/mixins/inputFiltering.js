import { ref, computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'

export function useInputFiltering() { 

  const search = ref('')
  const matchingStatus = ref(false)

  function changeSearch(newSearch) {
    search.value = newSearch
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
  
  const changeMatchingStatus = newMatchingStatus => {
    console.log('changeMatchingStatus', newMatchingStatus)
  }


  return {
    search,
    matchingStatus,
    changeSearch,
    changeMatchingStatus,
    highlight,
    handleFiltering,
  }
}
