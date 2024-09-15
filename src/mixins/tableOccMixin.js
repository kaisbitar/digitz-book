import { ref, computed, onMounted } from 'vue'

export function useTableOcc(props) {
  const windowHeight = ref(window.innerHeight)
  const collapseDone = ref(false)
  const search = ref('')
  const matchingStatus = ref(false)

  const getTableHeight = computed(() => {
    let tabHeight = 0
    if (props.includeTab) tabHeight = -20
    return windowHeight.value - 230 + tabHeight
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

  const highlight = (text, searchValue) => {
    if (!searchValue) return text
    return text.replace(new RegExp(searchValue, 'gi'), match => {
      return '<span style="background:yellow">' + match + '</span>'
    })
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
  }
}
