import { ref, computed, watch } from "vue"

export function useSimplePagination(itemsRef, itemsPerPage = 50) {
  const currentPage = ref(1)
  const totalItems = ref(0)
  const isLoading = ref(false)

  const paginatedItems = computed(() => {
    if (totalItems.value <= itemsPerPage) return itemsRef.value

    const end = currentPage.value * itemsPerPage
    return itemsRef.value?.slice(0, end) || []
  })

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

  const handleInfiniteScroll = () => {
    loadMoreItems()
  }

  watch(
    () => itemsRef.value,
    (newItems) => {
      totalItems.value = newItems?.length || 0
      resetPagination()
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
