import { nextTick } from "vue"
import { useGoTo } from "vuetify"

export function useWindow(elementRef) {
  const goTo = useGoTo()

  const scrollToItem = async (activeItem, container) => {
    await nextTick()
    setTimeout(() => {
      const activeVerseItem = document.querySelector(activeItem)
      if (!activeVerseItem) return

      goTo(activeVerseItem, {
        container: container,
        offset: -100,
        duration: 300,
        easing: "easeInOutCubic",
      })
    }, 100)
  }

  const scrollToActiveItem = async (activeItem, container) => {
    await scrollToItem(activeItem, container)
  }

  return {
    scrollToActiveItem,
  }
}
