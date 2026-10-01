import { nextTick } from "vue"
import { useGoTo } from "vuetify"

export function useWindow(elementRef) {
  const goTo = useGoTo()

  const scrollToItem = async (activeItem, container) => {
    await nextTick()
    setTimeout(() => {
      const activeVerseItem = document.querySelector(activeItem)
      const scrollContainer = document.querySelector(container)
      // A missing container falls back to the page. On a phone that scrolls
      // the whole screen. Skip it and leave the real containers unchanged.
      if (!activeVerseItem || !scrollContainer) return

      goTo(activeVerseItem, {
        container: scrollContainer,
        offset: -100,
        duration: 300,
        easing: "easeInOutCubic",
      })
    }, 300)
  }

  const scrollToActiveItem = async (activeItem, container) => {
    await scrollToItem(activeItem, container)
  }

  return {
    scrollToActiveItem,
  }
}
