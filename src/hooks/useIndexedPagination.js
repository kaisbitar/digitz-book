import { ref, computed, watch } from "vue"

export function useIndexedPagination(
  itemsRef,
  targetedIndexRef,
  itemsPerPage = 10
) {
  const currentPage = ref(1)
  const totalItems = ref(0)
  const isLoading = ref(false)

  const paginatedItems = computed(() => {
    if (totalItems.value <= itemsPerPage) return itemsRef.value

    const end = currentPage.value * itemsPerPage
    return (
      itemsRef.value?.slice(0, end).map((item, index) => ({
        ...item,
        originalIndex: parseInt(index),
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
    loadMoreItems()
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
