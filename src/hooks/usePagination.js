import { ref, computed, watch } from "vue"

export function usePagination(itemsRef, targetedIndexRef, itemsPerPage = 20) {
  const currentPage = ref(1)
  const totalItems = ref(0)

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return (
      itemsRef.value?.slice(start, end).map((item, index) => ({
        ...item,
        originalIndex: start + index,
      })) || []
    )
  })

  const handleLoading = () => {
    const targetIndex = itemsRef.value.findIndex(
      (item) => item.verseNumberToQuran === parseInt(targetedIndexRef.value)
    )
    if (targetIndex === -1) {
      loadMoreItems()
      return
    }
    currentPage.value = Math.floor(targetIndex / itemsPerPage) + 1
  }

  const loadMoreItems = () => {
    if (currentPage.value * itemsPerPage < totalItems.value) {
      currentPage.value++
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  const handleVirtualScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMoreItems()
    }
  }

  watch(
    () => itemsRef.value,
    (newItems) => {
      totalItems.value = newItems?.length || 0
      resetPagination()
      handleLoading()
    },
    { immediate: true }
  )

  return {
    currentPage,
    paginatedItems,
    loadMoreItems,
    resetPagination,
    handleVirtualScroll,
    handleLoading,
  }
}
