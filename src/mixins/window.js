import { computed, ref, onBeforeUnmount, nextTick } from "vue"
import { useQuranStore } from "@/stores/app"
import { useGoTo } from "vuetify"
import { useResizeHandler } from "@/hooks/useResizeObserver"

export function useWindow(props) {
  const store = useQuranStore()
  const goTo = useGoTo()

  const windowHeight = computed(() => window.innerHeight)
  const dynamicTableHeight = ref(0)

  const setContainerHeight = (containerRef, buffer = 20) => {
    if (
      containerRef &&
      containerRef.value &&
      typeof containerRef.value.getBoundingClientRect === "function"
    ) {
      const windowHeight = window.innerHeight
      const containerRect = containerRef.value.getBoundingClientRect()
      const containerTop = containerRect.top
      const newHeight = windowHeight - containerTop - buffer
      dynamicTableHeight.value = newHeight
      containerRef.value.style.height = `${newHeight}px`
    }
  }

  const scrollToItem = async (activeItem, container, isDialog) => {
    await nextTick()
    setTimeout(() => {
      const activeRowSelector = isDialog
        ? `.v-dialog ${activeItem}`
        : `${activeItem}`

      const activeVerseItem = document.querySelector(activeRowSelector)
      if (!activeVerseItem) return

      const baseContainer = isDialog ? `.v-dialog ${container}` : `${container}`

      goTo(activeVerseItem, {
        container: baseContainer,
        offset: -100,
        duration: 300,
        easing: "easeInOutCubic",
      })
    }, 100)
  }

  const scrollNoDialog = async (activeItem, container) => {
    await scrollToItem(activeItem, container, false)
  }

  const scrollToActiveItem = async (activeItem, container) => {
    const isDialog = store.getIsDialog
    await scrollToItem(activeItem, container, isDialog)
  }

  const { screen, handleResize } = useResizeHandler({
    updateHeight: () => setContainerHeight(props?.containerRef),
  })

  return {
    windowHeight,
    setContainerHeight,
    dynamicTableHeight,
    scrollToActiveItem,
    scrollNoDialog,
    screen,
    handleResize,
  }
}
