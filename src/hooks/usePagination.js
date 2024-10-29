import { ref, computed, watch } from "vue"

export function usePagination(itemsRef, targetedIndexRef, itemsPerPage = 50) {
  const currentPage = ref(1)
  const totalItems = ref(0)
  const isLoading = ref(false)

  const paginatedItems = computed(() => {
    const end = currentPage.value * itemsPerPage
    return (
      itemsRef.value?.slice(0, end).map((item, index) => ({
        ...item,
        originalIndex: index,
      })) || []
    )
  })

  const handleLoading = () => {
    const targetIndex = itemsRef.value.findIndex(
      (item) => item.verseNumberToQuran == targetedIndexRef.value
    )
    if (targetIndex === -1) {
      loadMoreItems()
      return
    }
    currentPage.value = Math.floor(targetIndex / itemsPerPage) + 1
  }

  const loadMoreItems = () => {
    if (
      currentPage.value * itemsPerPage < totalItems.value &&
      !isLoading.value
    ) {
      isLoading.value = true
      setTimeout(() => {
        currentPage.value++
        isLoading.value = false
      }, 300)
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  const handleInfiniteScroll = (event) => {
    if (!event) return
    loadMoreItems()
    // const { scrollTop, scrollHeight, clientHeight } = event.target
    // if (scrollTop + clientHeight >= scrollHeight - 100) {
    //   loadMoreItems()
    // }
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
    handleInfiniteScroll,
    isLoading,
  }
}
