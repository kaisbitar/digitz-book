import { ref, onMounted } from "vue"

export function useInfiniteScroll(fetchItems, options = {}) {
  const displayedItems = ref([])
  const currentPage = ref(1)
  const isLoading = ref(false)
  const allItemsLoadedDown = ref(false)
  const allItemsLoadedUp = ref(false)
  const isInitialized = ref(false)

  const {
    itemsPerPage = 100,
    scrollThreshold = 50,
    loadingDelay = 500,
    initialActiveItem = null,
  } = options

  const loadMoreItems = async (direction = "down") => {
    if (isLoading.value) return
    if (direction === "down" && allItemsLoadedDown.value) return
    if (
      direction === "up" &&
      (allItemsLoadedUp.value || currentPage.value === 1)
    )
      return

    isLoading.value = true

    try {
      let page =
        direction === "down"
          ? currentPage.value + 1
          : Math.max(1, currentPage.value - 1)
      const newItems = await fetchItems(page, itemsPerPage)

      if (newItems.length === 0) {
        direction === "down"
          ? (allItemsLoadedDown.value = true)
          : (allItemsLoadedUp.value = true)
        return
      }

      if (direction === "down") {
        displayedItems.value = [...displayedItems.value, ...newItems]
      } else {
        displayedItems.value = [...newItems, ...displayedItems.value]
      }
      currentPage.value = page
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, loadingDelay)
    }
  }

  const handleScroll = (event) => {
    if (!isInitialized.value) return

    const { scrollTop, scrollHeight, clientHeight } = event.target

    if (scrollTop <= scrollThreshold && currentPage.value > 1) {
      loadMoreItems("up")
      return
    }

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      loadMoreItems("down")
    }
  }

  const loadPageContainingItem = async (item) => {
    if (!item) return

    let page = 1
    let found = false

    while (!found && !allItemsLoadedDown.value) {
      const items = await fetchItems(page, itemsPerPage)
      if (items.length === 0) {
        allItemsLoadedDown.value = true
        break
      }

      found = items.some(
        (i) => i.verseNumberToQuran === item.verseNumberToQuran
      )
      if (found) {
        currentPage.value = page
        displayedItems.value = items
      } else {
        page++
      }
    }

    if (!found) {
      console.warn("Active item not found in the list")
    }
  }

  onMounted(async () => {
    if (initialActiveItem) {
      await loadPageContainingItem(initialActiveItem)
    } else {
      await loadMoreItems("down")
    }

    setTimeout(() => {
      isInitialized.value = true
    }, 500)
  })

  return {
    displayedItems,
    isLoading,
    allItemsLoadedDown,
    allItemsLoadedUp,
    handleScroll,
    loadMoreItems,
    loadPageContainingItem,
  }
}
